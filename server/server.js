/* eslint-disable quotes */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('http'), require('fs'), require('crypto')) :
        typeof define === 'function' && define.amd ? define(['http', 'fs', 'crypto'], factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Server = factory(global.http, global.fs, global.crypto));
}(this, (function (http, fs, crypto) {
    'use strict';

    function _interopDefaultLegacy(e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
    var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
    var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

    class ServiceError extends Error {
        constructor(message = 'Service Error') {
            super(message);
            this.name = 'ServiceError';
        }
    }

    class NotFoundError extends ServiceError {
        constructor(message = 'Resource not found') {
            super(message);
            this.name = 'NotFoundError';
            this.status = 404;
        }
    }

    class RequestError extends ServiceError {
        constructor(message = 'Request error') {
            super(message);
            this.name = 'RequestError';
            this.status = 400;
        }
    }

    class ConflictError extends ServiceError {
        constructor(message = 'Resource conflict') {
            super(message);
            this.name = 'ConflictError';
            this.status = 409;
        }
    }

    class AuthorizationError extends ServiceError {
        constructor(message = 'Unauthorized') {
            super(message);
            this.name = 'AuthorizationError';
            this.status = 401;
        }
    }

    class CredentialError extends ServiceError {
        constructor(message = 'Forbidden') {
            super(message);
            this.name = 'CredentialError';
            this.status = 403;
        }
    }

    var errors = {
        ServiceError,
        NotFoundError,
        RequestError,
        ConflictError,
        AuthorizationError,
        CredentialError
    };

    const { ServiceError: ServiceError$1 } = errors;


    function createHandler(plugins, services) {
        return async function handler(req, res) {
            const method = req.method;
            console.info(`<< ${req.method} ${req.url}`);

            // Redirect fix for admin panel relative paths
            if (req.url.slice(-6) == '/admin') {
                res.writeHead(302, {
                    'Location': `http://${req.headers.host}/admin/`
                });
                return res.end();
            }

            let status = 200;
            let headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            };
            let result = '';
            let context;

            // NOTE: the OPTIONS method results in undefined result and also it never processes plugins - keep this in mind
            if (method == 'OPTIONS') {
                Object.assign(headers, {
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Credentials': false,
                    'Access-Control-Max-Age': '86400',
                    'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Authorization, X-Admin'
                });
            } else {
                try {
                    context = processPlugins();
                    await handle(context);
                } catch (err) {
                    if (err instanceof ServiceError$1) {
                        status = err.status || 400;
                        result = composeErrorObject(err.code || status, err.message);
                    } else {
                        // Unhandled exception, this is due to an error in the service code - REST consumers should never have to encounter this;
                        // If it happens, it must be debugged in a future version of the server
                        console.error(err);
                        status = 500;
                        result = composeErrorObject(500, 'Server Error');
                    }
                }
            }

            res.writeHead(status, headers);
            if (context != undefined && context.util != undefined && context.util.throttle) {
                await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
            }
            res.end(result);

            function processPlugins() {
                const context = { params: {} };
                plugins.forEach(decorate => decorate(context, req));
                return context;
            }

            async function handle(context) {
                const { serviceName, tokens, query, body } = await parseRequest(req);
                if (serviceName == 'admin') {
                    return ({ headers, result } = services['admin'](method, tokens, query, body));
                } else if (serviceName == 'favicon.ico') {
                    return ({ headers, result } = services['favicon'](method, tokens, query, body));
                }

                const service = services[serviceName];

                if (service === undefined) {
                    status = 400;
                    result = composeErrorObject(400, `Service "${serviceName}" is not supported`);
                    console.error('Missing service ' + serviceName);
                } else {
                    result = await service(context, { method, tokens, query, body });
                }

                // NOTE: logout does not return a result
                // in this case the content type header should be omitted, to allow checks on the client
                if (result !== undefined) {
                    result = JSON.stringify(result);
                } else {
                    status = 204;
                    delete headers['Content-Type'];
                }
            }
        };
    }



    function composeErrorObject(code, message) {
        return JSON.stringify({
            code,
            message
        });
    }

    async function parseRequest(req) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const tokens = url.pathname.split('/').filter(x => x.length > 0);
        const serviceName = tokens.shift();
        const queryString = url.search.split('?')[1] || '';
        const query = queryString
            .split('&')
            .filter(s => s != '')
            .map(x => x.split('='))
            .reduce((p, [k, v]) => Object.assign(p, { [k]: decodeURIComponent(v) }), {});
        const body = await parseBody(req);

        return {
            serviceName,
            tokens,
            query,
            body
        };
    }

    function parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', (chunk) => body += chunk.toString());
            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (err) {
                    resolve(body);
                }
            });
        });
    }

    var requestHandler = createHandler;

    class Service {
        constructor() {
            this._actions = [];
            this.parseRequest = this.parseRequest.bind(this);
        }

        /**
         * Handle service request, after it has been processed by a request handler
         * @param {*} context Execution context, contains result of middleware processing
         * @param {{method: string, tokens: string[], query: *, body: *}} request Request parameters
         */
        async parseRequest(context, request) {
            for (let { method, name, handler } of this._actions) {
                if (method === request.method && matchAndAssignParams(context, request.tokens[0], name)) {
                    return await handler(context, request.tokens.slice(1), request.query, request.body);
                }
            }
        }

        /**
         * Register service action
         * @param {string} method HTTP method
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        registerAction(method, name, handler) {
            this._actions.push({ method, name, handler });
        }

        /**
         * Register GET action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        get(name, handler) {
            this.registerAction('GET', name, handler);
        }

        /**
         * Register POST action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        post(name, handler) {
            this.registerAction('POST', name, handler);
        }

        /**
         * Register PUT action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        put(name, handler) {
            this.registerAction('PUT', name, handler);
        }

        /**
         * Register PATCH action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        patch(name, handler) {
            this.registerAction('PATCH', name, handler);
        }

        /**
         * Register DELETE action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        delete(name, handler) {
            this.registerAction('DELETE', name, handler);
        }
    }

    function matchAndAssignParams(context, name, pattern) {
        if (pattern == '*') {
            return true;
        } else if (pattern[0] == ':') {
            context.params[pattern.slice(1)] = name;
            return true;
        } else if (name == pattern) {
            return true;
        } else {
            return false;
        }
    }

    var Service_1 = Service;

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    var util = {
        uuid
    };

    const uuid$1 = util.uuid;


    const data = fs__default['default'].existsSync('./data') ? fs__default['default'].readdirSync('./data').reduce((p, c) => {
        const content = JSON.parse(fs__default['default'].readFileSync('./data/' + c));
        const collection = c.slice(0, -5);
        p[collection] = {};
        for (let endpoint in content) {
            p[collection][endpoint] = content[endpoint];
        }
        return p;
    }, {}) : {};

    const actions = {
        get: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            let responseData = data;
            for (let token of tokens) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            return responseData;
        },
        post: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            // TODO handle collisions, replacement
            let responseData = data;
            for (let token of tokens) {
                if (responseData.hasOwnProperty(token) == false) {
                    responseData[token] = {};
                }
                responseData = responseData[token];
            }

            const newId = uuid$1();
            responseData[newId] = Object.assign({}, body, { _id: newId });
            return responseData[newId];
        },
        put: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            let responseData = data;
            for (let token of tokens.slice(0, -1)) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            if (responseData !== undefined && responseData[tokens.slice(-1)] !== undefined) {
                responseData[tokens.slice(-1)] = body;
            }
            return responseData[tokens.slice(-1)];
        },
        patch: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            let responseData = data;
            for (let token of tokens) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            if (responseData !== undefined) {
                Object.assign(responseData, body);
            }
            return responseData;
        },
        delete: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            let responseData = data;

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (responseData.hasOwnProperty(token) == false) {
                    return null;
                }
                if (i == tokens.length - 1) {
                    const body = responseData[token];
                    delete responseData[token];
                    return body;
                } else {
                    responseData = responseData[token];
                }
            }
        }
    };

    const dataService = new Service_1();
    dataService.get(':collection', actions.get);
    dataService.post(':collection', actions.post);
    dataService.put(':collection', actions.put);
    dataService.patch(':collection', actions.patch);
    dataService.delete(':collection', actions.delete);


    var jsonstore = dataService.parseRequest;

    /*
     * This service requires storage and auth plugins
     */

    const { AuthorizationError: AuthorizationError$1 } = errors;



    const userService = new Service_1();

    userService.get('me', getSelf);
    userService.post('register', onRegister);
    userService.post('login', onLogin);
    userService.get('logout', onLogout);


    function getSelf(context, tokens, query, body) {
        if (context.user) {
            const result = Object.assign({}, context.user);
            delete result.hashedPassword;
            return result;
        } else {
            throw new AuthorizationError$1();
        }
    }

    function onRegister(context, tokens, query, body) {
        return context.auth.register(body);
    }

    function onLogin(context, tokens, query, body) {
        return context.auth.login(body);
    }

    function onLogout(context, tokens, query, body) {
        return context.auth.logout();
    }

    var users = userService.parseRequest;

    const { NotFoundError: NotFoundError$1, RequestError: RequestError$1 } = errors;


    var crud = {
        get,
        post,
        put,
        patch,
        delete: del
    };


    function validateRequest(context, tokens, query) {
        /*
        if (context.params.collection == undefined) {
            throw new RequestError('Please, specify collection name');
        }
        */
        if (tokens.length > 1) {
            throw new RequestError$1();
        }
    }

    function parseWhere(query) {
        const operators = {
            '<=': (prop, value) => record => record[prop] <= JSON.parse(value),
            '<': (prop, value) => record => record[prop] < JSON.parse(value),
            '>=': (prop, value) => record => record[prop] >= JSON.parse(value),
            '>': (prop, value) => record => record[prop] > JSON.parse(value),
            '=': (prop, value) => record => record[prop] == JSON.parse(value),
            ' like ': (prop, value) => record => record[prop].toLowerCase().includes(JSON.parse(value).toLowerCase()),
            ' in ': (prop, value) => record => JSON.parse(`[${/\((.+?)\)/.exec(value)[1]}]`).includes(record[prop]),
        };
        const pattern = new RegExp(`^(.+?)(${Object.keys(operators).join('|')})(.+?)$`, 'i');

        try {
            let clauses = [query.trim()];
            let check = (a, b) => b;
            let acc = true;
            if (query.match(/ and /gi)) {
                // inclusive
                clauses = query.split(/ and /gi);
                check = (a, b) => a && b;
                acc = true;
            } else if (query.match(/ or /gi)) {
                // optional
                clauses = query.split(/ or /gi);
                check = (a, b) => a || b;
                acc = false;
            }
            clauses = clauses.map(createChecker);

            return (record) => clauses
                .map(c => c(record))
                .reduce(check, acc);
        } catch (err) {
            throw new Error('Could not parse WHERE clause, check your syntax.');
        }

        function createChecker(clause) {
            let [match, prop, operator, value] = pattern.exec(clause);
            [prop, value] = [prop.trim(), value.trim()];

            return operators[operator.toLowerCase()](prop, value);
        }
    }


    function get(context, tokens, query, body) {
        validateRequest(context, tokens);

        let responseData;

        try {
            if (query.where) {
                responseData = context.storage.get(context.params.collection).filter(parseWhere(query.where));
            } else if (context.params.collection) {
                responseData = context.storage.get(context.params.collection, tokens[0]);
            } else {
                // Get list of collections
                return context.storage.get();
            }

            if (query.sortBy) {
                const props = query.sortBy
                    .split(',')
                    .filter(p => p != '')
                    .map(p => p.split(' ').filter(p => p != ''))
                    .map(([p, desc]) => ({ prop: p, desc: desc ? true : false }));

                // Sorting priority is from first to last, therefore we sort from last to first
                for (let i = props.length - 1; i >= 0; i--) {
                    let { prop, desc } = props[i];
                    responseData.sort(({ [prop]: propA }, { [prop]: propB }) => {
                        if (typeof propA == 'number' && typeof propB == 'number') {
                            return (propA - propB) * (desc ? -1 : 1);
                        } else {
                            return propA.localeCompare(propB) * (desc ? -1 : 1);
                        }
                    });
                }
            }

            if (query.offset) {
                responseData = responseData.slice(Number(query.offset) || 0);
            }
            const pageSize = Number(query.pageSize) || 10;
            if (query.pageSize) {
                responseData = responseData.slice(0, pageSize);
            }

            if (query.distinct) {
                const props = query.distinct.split(',').filter(p => p != '');
                responseData = Object.values(responseData.reduce((distinct, c) => {
                    const key = props.map(p => c[p]).join('::');
                    if (distinct.hasOwnProperty(key) == false) {
                        distinct[key] = c;
                    }
                    return distinct;
                }, {}));
            }

            if (query.count) {
                return responseData.length;
            }

            if (query.select) {
                const props = query.select.split(',').filter(p => p != '');
                responseData = Array.isArray(responseData) ? responseData.map(transform) : transform(responseData);

                function transform(r) {
                    const result = {};
                    props.forEach(p => result[p] = r[p]);
                    return result;
                }
            }

            if (query.load) {
                const props = query.load.split(',').filter(p => p != '');
                props.map(prop => {
                    const [propName, relationTokens] = prop.split('=');
                    const [idSource, collection] = relationTokens.split(':');
                    console.log(`Loading related records from "${collection}" into "${propName}", joined on "_id"="${idSource}"`);
                    const storageSource = collection == 'users' ? context.protectedStorage : context.storage;
                    responseData = Array.isArray(responseData) ? responseData.map(transform) : transform(responseData);

                    function transform(r) {
                        const seekId = r[idSource];
                        const related = storageSource.get(collection, seekId);
                        delete related.hashedPassword;
                        r[propName] = related;
                        return r;
                    }
                });
            }

        } catch (err) {
            console.error(err);
            if (err.message.includes('does not exist')) {
                throw new NotFoundError$1();
            } else {
                throw new RequestError$1(err.message);
            }
        }

        context.canAccess(responseData);

        return responseData;
    }

    function post(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length > 0) {
            throw new RequestError$1('Use PUT to update records');
        }
        context.canAccess(undefined, body);

        body._ownerId = context.user._id;
        let responseData;

        try {
            responseData = context.storage.add(context.params.collection, body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function put(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing, body);

        try {
            responseData = context.storage.set(context.params.collection, tokens[0], body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function patch(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing, body);

        try {
            responseData = context.storage.merge(context.params.collection, tokens[0], body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function del(context, tokens, query, body) {
        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing);

        try {
            responseData = context.storage.delete(context.params.collection, tokens[0]);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    /*
     * This service requires storage and auth plugins
     */

    const dataService$1 = new Service_1();
    dataService$1.get(':collection', crud.get);
    dataService$1.post(':collection', crud.post);
    dataService$1.put(':collection', crud.put);
    dataService$1.patch(':collection', crud.patch);
    dataService$1.delete(':collection', crud.delete);

    var data$1 = dataService$1.parseRequest;

    const imgdata = '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Td4DLneAwSddMiRH8tMU8nng/Yy+KQsM3AKBNbe35j5OH4A0dbV8AxwcAqMFyl73eHd3e2//nmn29wOGi3Kv+RixSgAAEkxpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjdjZDM3NWM3LTcwNmItNDlkMy1hOWRkLWNmM2Q3MmMwY2I4ZCIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NGY2YTJlYy04ZjA5LTRkZTMtOTY3ZC05MTUyY2U5NjYxNTAiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMmE1NzI5Mi1kNmJkLTRlYjQtOGUxNi1hODEzYjMwZjU0NWYiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjEzMzAwNzI5NTMwNjQzIgogICBHSU1QOlZlcnNpb249IjIuMTAuMTIiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBwaG90b3Nob3A6Q3JlZGl0PSJHZXR0eSBJbWFnZXMvaVN0b2NrcGhvdG8iCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwczovL3d3dy5pc3RvY2twaG90by5jb20vbGVnYWwvbGljZW5zZS1hZ3JlZW1lbnQ/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmwiPgogICA8aXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgIDxpcHRjRXh0OkxvY2F0aW9uU2hvd24+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvblNob3duPgogICA8aXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgIDxpcHRjRXh0OlJlZ2lzdHJ5SWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpSZWdpc3RyeUlkPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjOTQ2M2MxMC05OWE4LTQ1NDQtYmRlOS1mNzY0ZjdhODJlZDkiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoV2luZG93cykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjEtMDItMTRUMTM6MDU6MjkiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogICA8cGx1czpJbWFnZVN1cHBsaWVyPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VTdXBwbGllcj4KICAgPHBsdXM6SW1hZ2VDcmVhdG9yPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VDcmVhdG9yPgogICA8cGx1czpDb3B5cmlnaHRPd25lcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkNvcHlyaWdodE93bmVyPgogICA8cGx1czpMaWNlbnNvcj4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgcGx1czpMaWNlbnNvclVSTD0iaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL3Bob3RvL2xpY2Vuc2UtZ20xMTUwMzQ1MzQxLT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIvPgogICAgPC9yZGY6U2VxPgogICA8L3BsdXM6TGljZW5zb3I+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5WbGFkeXNsYXYgU2VyZWRhPC9yZGY6bGk+CiAgICA8L3JkZjpTZXE+CiAgIDwvZGM6Y3JlYXRvcj4KICAgPGRjOmRlc2NyaXB0aW9uPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5TZXJ2aWNlIHRvb2xzIGljb24gb24gd2hpdGUgYmFja2dyb3VuZC4gVmVjdG9yIGlsbHVzdHJhdGlvbi48L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpkZXNjcmlwdGlvbj4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmWJCnkAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflAg4LBR0CZnO/AAAARHRFWHRDb21tZW50AFNlcnZpY2UgdG9vbHMgaWNvbiBvbiB3aGl0ZSBiYWNrZ3JvdW5kLiBWZWN0b3IgaWxsdXN0cmF0aW9uLlwvEeIAAAMxSURBVHja7Z1bcuQwCEX7qrLQXlp2ynxNVWbK7dgWj3sl9JvYRhxACD369erW7UMzx/cYaychonAQvXM5ABYkpynoYIiEGdoQog6AYfywBrCxF4zNrX/7McBbuXJe8rXx/KBDULcGsMREzCbeZ4J6ME/9wVH5d95rogZp3npEgPLP3m2iUSGqXBJS5Dr6hmLm8kRuZABYti5TMaailV8LodNQwTTUWk4/WZk75l0kM0aZQdaZjMqkrQDAuyMVJWFjMB4GANXr0lbZBxQKr7IjI7QvVWkok/Jn5UHVh61CYPs+/i7eL9j3y/Au8WqoAIC34k8/9k7N8miLcaGWHwgjZXE/awyYX7h41wKMCskZM2HXAddDkTdglpSjz5bcKPbcCEKwT3+DhxtVpJvkEC7rZSgq32NMSBoXaCdiahDCKrND0fpX8oQlVsQ8IFQZ1VARdIF5wroekAjB07gsAgDUIbQHFENIDEX4CQANIVe8Iw/ASiACLXl28eaf579OPuBa9/mrELUYHQ1t3KHlZZnRcXb2/c7ygXIQZqjDMEzeSrOgCAhqYMvTUE+FKXoVxTxgk3DEPREjGzj3nAk/VaKyB9GVIu4oMyOlrQZgrBBEFG9PAZTfs3amYDGrP9Wl964IeFvtz9JFluIvlEvcdoXDOdxggbDxGwTXcxFRi/LdirKgZUBm7SUdJG69IwSUzAMWgOAq/4hyrZVaJISSNWHFVbEoCFEhyBrCtXS9L+so9oTy8wGqxbQDD350WTjNESVFEB5hdKzUGcV5QtYxVWR2Ssl4Mg9qI9u6FCBInJRXgfEEgtS9Cgrg7kKouq4mdcDNBnEHQvWFTdgdgsqP+MiluVeBM13ahx09AYSWi50gsF+I6vn7BmCEoHR3NBzkpIOw4+XdVBBGQUioblaZHbGlodtB+N/jxqwLX/x/NARfD8ADxTOCKIcwE4Lw0OIbguMYcGTlymEpHYLXIKx8zQEqIfS2lGJPaADFEBR/PMH79ErqtpnZmTBlvM4wgihPWDEEhXn1LISj50crNgfCp+dWHYQRCfb2zgfnBZmKGAyi914anK9Coi4LOMhoAn3uVtn+AGnLKxPUZnCuAAAAAElFTkSuQmCC';
    const img = Buffer.from(imgdata, 'base64');

    var favicon = (method, tokens, query, body) => {
        console.log('serving favicon...');
        const headers = {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        };
        let result = img;

        return {
            headers,
            result
        };
    };

    var require$$0 = "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>SUPS Admin Panel</title>\r\n    <style>\r\n        * {\r\n            padding: 0;\r\n            margin: 0;\r\n        }\r\n\r\n        body {\r\n            padding: 32px;\r\n            font-size: 16px;\r\n        }\r\n\r\n        .layout::after {\r\n            content: '';\r\n            clear: both;\r\n            display: table;\r\n        }\r\n\r\n        .col {\r\n            display: block;\r\n            float: left;\r\n        }\r\n\r\n        p {\r\n            padding: 8px 16px;\r\n        }\r\n\r\n        table {\r\n            border-collapse: collapse;\r\n        }\r\n\r\n        caption {\r\n            font-size: 120%;\r\n            text-align: left;\r\n            padding: 4px 8px;\r\n            font-weight: bold;\r\n            background-color: #ddd;\r\n        }\r\n\r\n        table, tr, th, td {\r\n            border: 1px solid #ddd;\r\n        }\r\n\r\n        th, td {\r\n            padding: 4px 8px;\r\n        }\r\n\r\n        ul {\r\n            list-style: none;\r\n        }\r\n\r\n        .collection-list a {\r\n            display: block;\r\n            width: 120px;\r\n            padding: 4px 8px;\r\n            text-decoration: none;\r\n            color: black;\r\n            background-color: #ccc;\r\n        }\r\n        .collection-list a:hover {\r\n            background-color: #ddd;\r\n        }\r\n        .collection-list a:visited {\r\n            color: black;\r\n        }\r\n    </style>\r\n    <script type=\"module\">\nimport { html, render } from 'https://unpkg.com/lit-html?module';\nimport { until } from 'https://unpkg.com/lit-html/directives/until?module';\n\nconst api = {\r\n    async get(url) {\r\n        return json(url);\r\n    },\r\n    async post(url, body) {\r\n        return json(url, {\r\n            method: 'POST',\r\n            headers: { 'Content-Type': 'application/json' },\r\n            body: JSON.stringify(body)\r\n        });\r\n    }\r\n};\r\n\r\nasync function json(url, options) {\r\n    return await (await fetch('/' + url, options)).json();\r\n}\r\n\r\nasync function getCollections() {\r\n    return api.get('data');\r\n}\r\n\r\nasync function getRecords(collection) {\r\n    return api.get('data/' + collection);\r\n}\r\n\r\nasync function getThrottling() {\r\n    return api.get('util/throttle');\r\n}\r\n\r\nasync function setThrottling(throttle) {\r\n    return api.post('util', { throttle });\r\n}\n\nasync function collectionList(onSelect) {\r\n    const collections = await getCollections();\r\n\r\n    return html`\r\n    <ul class=\"collection-list\">\r\n        ${collections.map(collectionLi)}\r\n    </ul>`;\r\n\r\n    function collectionLi(name) {\r\n        return html`<li><a href=\"javascript:void(0)\" @click=${(ev) => onSelect(ev, name)}>${name}</a></li>`;\r\n    }\r\n}\n\nasync function recordTable(collectionName) {\r\n    const records = await getRecords(collectionName);\r\n    const layout = getLayout(records);\r\n\r\n    return html`\r\n    <table>\r\n        <caption>${collectionName}</caption>\r\n        <thead>\r\n            <tr>${layout.map(f => html`<th>${f}</th>`)}</tr>\r\n        </thead>\r\n        <tbody>\r\n            ${records.map(r => recordRow(r, layout))}\r\n        </tbody>\r\n    </table>`;\r\n}\r\n\r\nfunction getLayout(records) {\r\n    const result = new Set(['_id']);\r\n    records.forEach(r => Object.keys(r).forEach(k => result.add(k)));\r\n\r\n    return [...result.keys()];\r\n}\r\n\r\nfunction recordRow(record, layout) {\r\n    return html`\r\n    <tr>\r\n        ${layout.map(f => html`<td>${JSON.stringify(record[f]) || html`<span>(missing)</span>`}</td>`)}\r\n    </tr>`;\r\n}\n\nasync function throttlePanel(display) {\r\n    const active = await getThrottling();\r\n\r\n    return html`\r\n    <p>\r\n        Request throttling: </span>${active}</span>\r\n        <button @click=${(ev) => set(ev, true)}>Enable</button>\r\n        <button @click=${(ev) => set(ev, false)}>Disable</button>\r\n    </p>`;\r\n\r\n    async function set(ev, state) {\r\n        ev.target.disabled = true;\r\n        await setThrottling(state);\r\n        display();\r\n    }\r\n}\n\n//import page from '//unpkg.com/page/page.mjs';\r\n\r\n\r\nfunction start() {\r\n    const main = document.querySelector('main');\r\n    editor(main);\r\n}\r\n\r\nasync function editor(main) {\r\n    let list = html`<div class=\"col\">Loading&hellip;</div>`;\r\n    let viewer = html`<div class=\"col\">\r\n    <p>Select collection to view records</p>\r\n</div>`;\r\n    display();\r\n\r\n    list = html`<div class=\"col\">${await collectionList(onSelect)}</div>`;\r\n    display();\r\n\r\n    async function display() {\r\n        render(html`\r\n        <section class=\"layout\">\r\n            ${until(throttlePanel(display), html`<p>Loading</p>`)}\r\n        </section>\r\n        <section class=\"layout\">\r\n            ${list}\r\n            ${viewer}\r\n        </section>`, main);\r\n    }\r\n\r\n    async function onSelect(ev, name) {\r\n        ev.preventDefault();\r\n        viewer = html`<div class=\"col\">${await recordTable(name)}</div>`;\r\n        display();\r\n    }\r\n}\r\n\r\nstart();\n\n</script>\r\n</head>\r\n<body>\r\n    <main>\r\n        Loading&hellip;\r\n    </main>\r\n</body>\r\n</html>";

    const mode = process.argv[2] == '-dev' ? 'dev' : 'prod';

    const files = {
        index: mode == 'prod' ? require$$0 : fs__default['default'].readFileSync('./client/index.html', 'utf-8')
    };

    var admin = (method, tokens, query, body) => {
        const headers = {
            'Content-Type': 'text/html'
        };
        let result = '';

        const resource = tokens.join('/');
        if (resource && resource.split('.').pop() == 'js') {
            headers['Content-Type'] = 'application/javascript';

            files[resource] = files[resource] || fs__default['default'].readFileSync('./client/' + resource, 'utf-8');
            result = files[resource];
        } else {
            result = files.index;
        }

        return {
            headers,
            result
        };
    };

    /*
     * This service requires util plugin
     */

    const utilService = new Service_1();

    utilService.post('*', onRequest);
    utilService.get(':service', getStatus);

    function getStatus(context, tokens, query, body) {
        return context.util[context.params.service];
    }

    function onRequest(context, tokens, query, body) {
        Object.entries(body).forEach(([k, v]) => {
            console.log(`${k} ${v ? 'enabled' : 'disabled'}`);
            context.util[k] = v;
        });
        return '';
    }

    var util$1 = utilService.parseRequest;

    var services = {
        jsonstore,
        users,
        data: data$1,
        favicon,
        admin,
        util: util$1
    };

    const { uuid: uuid$2 } = util;


    function initPlugin(settings) {
        const storage = createInstance(settings.seedData);
        const protectedStorage = createInstance(settings.protectedData);

        return function decoreateContext(context, request) {
            context.storage = storage;
            context.protectedStorage = protectedStorage;
        };
    }


    /**
     * Create storage instance and populate with seed data
     * @param {Object=} seedData Associative array with data. Each property is an object with properties in format {key: value}
     */
    function createInstance(seedData = {}) {
        const collections = new Map();

        // Initialize seed data from file    
        for (let collectionName in seedData) {
            if (seedData.hasOwnProperty(collectionName)) {
                const collection = new Map();
                for (let recordId in seedData[collectionName]) {
                    if (seedData.hasOwnProperty(collectionName)) {
                        collection.set(recordId, seedData[collectionName][recordId]);
                    }
                }
                collections.set(collectionName, collection);
            }
        }


        // Manipulation

        /**
         * Get entry by ID or list of all entries from collection or list of all collections
         * @param {string=} collection Name of collection to access. Throws error if not found. If omitted, returns list of all collections.
         * @param {number|string=} id ID of requested entry. Throws error if not found. If omitted, returns of list all entries in collection.
         * @return {Object} Matching entry.
         */
        function get(collection, id) {
            if (!collection) {
                return [...collections.keys()];
            }
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!id) {
                const entries = [...targetCollection.entries()];
                let result = entries.map(([k, v]) => {
                    return Object.assign(deepCopy(v), { _id: k });
                });
                return result;
            }
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }
            const entry = targetCollection.get(id);
            return Object.assign(deepCopy(entry), { _id: id });
        }

        /**
         * Add new entry to collection. ID will be auto-generated
         * @param {string} collection Name of collection to access. If the collection does not exist, it will be created.
         * @param {Object} data Value to store.
         * @return {Object} Original value with resulting ID under _id property.
         */
        function add(collection, data) {
            const record = assignClean({ _ownerId: data._ownerId }, data);

            let targetCollection = collections.get(collection);
            if (!targetCollection) {
                targetCollection = new Map();
                collections.set(collection, targetCollection);
            }
            let id = uuid$2();
            // Make sure new ID does not match existing value
            while (targetCollection.has(id)) {
                id = uuid$2();
            }

            record._createdOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Replace entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @param {Object} data Value to store. Record will be replaced!
         * @return {Object} Updated entry.
         */
        function set(collection, id, data) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }

            const existing = targetCollection.get(id);
            const record = assignSystemProps(deepCopy(data), existing);
            record._updatedOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Modify entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @param {Object} data Value to store. Shallow merge will be performed!
         * @return {Object} Updated entry.
         */
        function merge(collection, id, data) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }

            const existing = deepCopy(targetCollection.get(id));
            const record = assignClean(existing, data);
            record._updatedOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Delete entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @return {{_deletedOn: number}} Server time of deletion.
         */
        function del(collection, id) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }
            targetCollection.delete(id);

            return { _deletedOn: Date.now() };
        }

        /**
         * Search in collection by query object
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {Object} query Query object. Format {prop: value}.
         * @return {Object[]} Array of matching entries.
         */
        function query(collection, query) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            const result = [];
            // Iterate entries of target collection and compare each property with the given query
            for (let [key, entry] of [...targetCollection.entries()]) {
                let match = true;
                for (let prop in entry) {
                    if (query.hasOwnProperty(prop)) {
                        const targetValue = query[prop];
                        // Perform lowercase search, if value is string
                        if (typeof targetValue === 'string' && typeof entry[prop] === 'string') {
                            if (targetValue.toLocaleLowerCase() !== entry[prop].toLocaleLowerCase()) {
                                match = false;
                                break;
                            }
                        } else if (targetValue != entry[prop]) {
                            match = false;
                            break;
                        }
                    }
                }

                if (match) {
                    result.push(Object.assign(deepCopy(entry), { _id: key }));
                }
            }

            return result;
        }

        return { get, add, set, merge, delete: del, query };
    }


    function assignSystemProps(target, entry, ...rest) {
        const whitelist = [
            '_id',
            '_createdOn',
            '_updatedOn',
            '_ownerId'
        ];
        for (let prop of whitelist) {
            if (entry.hasOwnProperty(prop)) {
                target[prop] = deepCopy(entry[prop]);
            }
        }
        if (rest.length > 0) {
            Object.assign(target, ...rest);
        }

        return target;
    }


    function assignClean(target, entry, ...rest) {
        const blacklist = [
            '_id',
            '_createdOn',
            '_updatedOn',
            '_ownerId'
        ];
        for (let key in entry) {
            if (blacklist.includes(key) == false) {
                target[key] = deepCopy(entry[key]);
            }
        }
        if (rest.length > 0) {
            Object.assign(target, ...rest);
        }

        return target;
    }

    function deepCopy(value) {
        if (Array.isArray(value)) {
            return value.map(deepCopy);
        } else if (typeof value == 'object') {
            return [...Object.entries(value)].reduce((p, [k, v]) => Object.assign(p, { [k]: deepCopy(v) }), {});
        } else {
            return value;
        }
    }

    var storage = initPlugin;

    const { ConflictError: ConflictError$1, CredentialError: CredentialError$1, RequestError: RequestError$2 } = errors;

    function initPlugin$1(settings) {
        const identity = settings.identity;

        return function decorateContext(context, request) {
            context.auth = {
                register,
                login,
                logout
            };

            const userToken = request.headers['x-authorization'];
            if (userToken !== undefined) {
                let user;
                const session = findSessionByToken(userToken);
                if (session !== undefined) {
                    const userData = context.protectedStorage.get('users', session.userId);
                    if (userData !== undefined) {
                        console.log('Authorized as ' + userData[identity]);
                        user = userData;
                    }
                }
                if (user !== undefined) {
                    context.user = user;
                } else {
                    throw new CredentialError$1('Invalid access token');
                }
            }

            function register(body) {
                if (body.hasOwnProperty(identity) === false ||
                    body.hasOwnProperty('password') === false ||
                    body[identity].length == 0 ||
                    body.password.length == 0) {
                    throw new RequestError$2('Missing fields');
                } else if (context.protectedStorage.query('users', { [identity]: body[identity] }).length !== 0) {
                    throw new ConflictError$1(`A user with the same ${identity} already exists`);
                } else {
                    const newUser = Object.assign({}, body, {
                        [identity]: body[identity],
                        hashedPassword: hash(body.password)
                    });
                    const result = context.protectedStorage.add('users', newUser);
                    delete result.hashedPassword;

                    const session = saveSession(result._id);
                    result.accessToken = session.accessToken;

                    return result;
                }
            }

            function login(body) {
                const targetUser = context.protectedStorage.query('users', { [identity]: body[identity] });
                if (targetUser.length == 1) {
                    if (hash(body.password) === targetUser[0].hashedPassword) {
                        const result = targetUser[0];
                        delete result.hashedPassword;

                        const session = saveSession(result._id);
                        result.accessToken = session.accessToken;

                        return result;
                    } else {
                        throw new CredentialError$1('Login or password don\'t match');
                    }
                } else {
                    throw new CredentialError$1('Login or password don\'t match');
                }
            }

            function logout() {
                if (context.user !== undefined) {
                    const session = findSessionByUserId(context.user._id);
                    if (session !== undefined) {
                        context.protectedStorage.delete('sessions', session._id);
                    }
                } else {
                    throw new CredentialError$1('User session does not exist');
                }
            }

            function saveSession(userId) {
                let session = context.protectedStorage.add('sessions', { userId });
                const accessToken = hash(session._id);
                session = context.protectedStorage.set('sessions', session._id, Object.assign({ accessToken }, session));
                return session;
            }

            function findSessionByToken(userToken) {
                return context.protectedStorage.query('sessions', { accessToken: userToken })[0];
            }

            function findSessionByUserId(userId) {
                return context.protectedStorage.query('sessions', { userId })[0];
            }
        };
    }


    const secret = 'This is not a production server';

    function hash(string) {
        const hash = crypto__default['default'].createHmac('sha256', secret);
        hash.update(string);
        return hash.digest('hex');
    }

    var auth = initPlugin$1;

    function initPlugin$2(settings) {
        const util = {
            throttle: false
        };

        return function decoreateContext(context, request) {
            context.util = util;
        };
    }

    var util$2 = initPlugin$2;

    /*
     * This plugin requires auth and storage plugins
     */

    const { RequestError: RequestError$3, ConflictError: ConflictError$2, CredentialError: CredentialError$2, AuthorizationError: AuthorizationError$2 } = errors;

    function initPlugin$3(settings) {
        const actions = {
            'GET': '.read',
            'POST': '.create',
            'PUT': '.update',
            'PATCH': '.update',
            'DELETE': '.delete'
        };
        const rules = Object.assign({
            '*': {
                '.create': ['User'],
                '.update': ['Owner'],
                '.delete': ['Owner']
            }
        }, settings.rules);

        return function decorateContext(context, request) {
            // special rules (evaluated at run-time)
            const get = (collectionName, id) => {
                return context.storage.get(collectionName, id);
            };
            const isOwner = (user, object) => {
                return user._id == object._ownerId;
            };
            context.rules = {
                get,
                isOwner
            };
            const isAdmin = request.headers.hasOwnProperty('x-admin');

            context.canAccess = canAccess;

            function canAccess(data, newData) {
                const user = context.user;
                const action = actions[request.method];
                let { rule, propRules } = getRule(action, context.params.collection, data);

                if (Array.isArray(rule)) {
                    rule = checkRoles(rule, data);
                } else if (typeof rule == 'string') {
                    rule = !!(eval(rule));
                }
                if (!rule && !isAdmin) {
                    throw new CredentialError$2();
                }
                propRules.map(r => applyPropRule(action, r, user, data, newData));
            }

            function applyPropRule(action, [prop, rule], user, data, newData) {
                // NOTE: user needs to be in scope for eval to work on certain rules
                if (typeof rule == 'string') {
                    rule = !!eval(rule);
                }

                if (rule == false) {
                    if (action == '.create' || action == '.update') {
                        delete newData[prop];
                    } else if (action == '.read') {
                        delete data[prop];
                    }
                }
            }

            function checkRoles(roles, data, newData) {
                if (roles.includes('Guest')) {
                    return true;
                } else if (!context.user && !isAdmin) {
                    throw new AuthorizationError$2();
                } else if (roles.includes('User')) {
                    return true;
                } else if (context.user && roles.includes('Owner')) {
                    return context.user._id == data._ownerId;
                } else {
                    return false;
                }
            }
        };



        function getRule(action, collection, data = {}) {
            let currentRule = ruleOrDefault(true, rules['*'][action]);
            let propRules = [];

            // Top-level rules for the collection
            const collectionRules = rules[collection];
            if (collectionRules !== undefined) {
                // Top-level rule for the specific action for the collection
                currentRule = ruleOrDefault(currentRule, collectionRules[action]);

                // Prop rules
                const allPropRules = collectionRules['*'];
                if (allPropRules !== undefined) {
                    propRules = ruleOrDefault(propRules, getPropRule(allPropRules, action));
                }

                // Rules by record id 
                const recordRules = collectionRules[data._id];
                if (recordRules !== undefined) {
                    currentRule = ruleOrDefault(currentRule, recordRules[action]);
                    propRules = ruleOrDefault(propRules, getPropRule(recordRules, action));
                }
            }

            return {
                rule: currentRule,
                propRules
            };
        }

        function ruleOrDefault(current, rule) {
            return (rule === undefined || rule.length === 0) ? current : rule;
        }

        function getPropRule(record, action) {
            const props = Object
                .entries(record)
                .filter(([k]) => k[0] != '.')
                .filter(([k, v]) => v.hasOwnProperty(action))
                .map(([k, v]) => [k, v[action]]);

            return props;
        }
    }

    var rules = initPlugin$3;

    var identity = "email";
    var protectedData = {
        users: {
            "35c62d76-8152-4626-8712-eeb96381bea8": {
                email: "sboyukliev1990@mail.bg",
                hashedPassword: "83313014ed3e2391aa1332615d2f053cf5c1bfe05ca1cbcb5582443822df6eb1",
                username: "Sully"
            },
            "847ec027-f659-4086-8032-5173e2f9c93a": {
                email: "admin@abv.bg",
                hashedPassword: "83313014ed3e2391aa1332615d2f053cf5c1bfe05ca1cbcb5582443822df6eb1",
                username:"Admin"
            }
        },
        sessions: {
        }
    };
    var seedData = {
        books: {
            "ff436770-76c5-40e2-b231-77409eda7a61": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a61",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "И дъхът стана въздух",
                "name":"when-breath-become-air",
                "author": "Пол Каланити",
                "category": "best-seller",
                "summary": "Всички животи имат еднаква стойност. Но понякога смъртта е особено жестока. Тази книга ме остави облян в сълзи. Бил Гейтс Пол Каланити не иска да бъде неврохирург като вечно отсъстващия си баща, затова се насочва към литературата и получава магистърска степе по история и философия на науката и медицината в Кеймбридж. Защитата на дисертацията му е върху творчеството на поета Уолт Уитман Но въпросът за смисъла на живота не спира да го преследва – и отговор той открива именно в лекарското си призвание Следва десетилетие на неимоверно тежък труд и усърдно учене, докато ръцете му започват да спасяват живот след живот. Пол Каланити се превръща в една от младите звезди на американската неврохирургия. Докато един ден не отива на лекар, който да потвърди диагнозата, която вече сам си е поставил. Рак в напреднал стадий. Пол е само на 36. Докато той и семейството му повеждат отчаяна, безнадеждна битка, той сяда да пише тази книга, която вече е преведена на десетки езици и дава утеха на читателите. Каланити прави равносметка на живота си, на лекарската професия, на моралния си дълг към близките си и своите пациенти. В крайна сметка „И дъхът стана въздух” е много повече от разказ за битката със смъртта – той е за приемането на нашата тленност и за извървяването на пътя докрай с високо вдигната глава Но макар да не знаех какво искам, бях научил нещо – нещо, което не бях открил у Хипократ, Маймонид или Ослър : задачата на лекаря не е да спаси задължително пациента от смъртта или да го върне към предишния му живот. Не,  тя е да приеме под крилото си болния и неговите близки, когато животът им се разпада, и да работи с тях, докато те се изправят отново на крака и открият какво осмисля живота им. Пол Каланити",
                "imageUrl": "/img/when-breath-become-air.jpg",
                "description": "Книгата на Пол Каланити „И дъхът стана въздух“ е най-добрият мемоар на 2016 година според читателите в сайта Goodreads и е сред най-добрите книги за 2016 година според The Washington Post и The New York Times. Освен похвалите книгата притежава неумолимото послание на неугасващата надежда за достойно живян живот, в който смъртта е по-лесна за приемане.",
                "_createdOn": 1617194128646,
                "rating":5,
            },
            "ff436770-76c5-40e2-b231-77409eda7a62": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a62",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "Вихър от мечове - Kнига 3 Игра на тронове",
                "author": "Джордж Р. Р. Мартин",
                "category": "fantasy",
                "summary": "Сложността на такива характери като Денерис, Аря и Кралеубиеца ще накара читателите да разгръщат жадно огромния брой страници на тази книга, тъй като авторът им, също като Толкин и Джордан, подклажда непрестанния интерес към съдбата им. Мартин неизбежно ни напомня за тези двама велики в жанра и с дарбата си да опише такива чувствени преживявания като стихията на дивия пожар и ледения мраз, морския мирис, както и безмерната пищност на средновековния пир. Някои твърдят, че тази сага надхвърля всичко достигнато досега във върховното фентъзи. Кой знае? Във всеки случай постигнатото е достатъчно, за да превърне Песен за огън е лед в безспорен хит в жанра. Пъблишърс Уикли",
                "imageUrl": "/img/game-of-thrones-book3.jpg",
                "description": "Бестселър фентъзи сагата на Джордж Р. Р. Мартин Песен за огън и лед в нови дрехи... Докато създаденият с богато въображение свят на Джордж Р. Р. Мартин необратимо се приближава към своята десетгодишна зима, се влошава не само времето, а и войната. На север крал Джофри от дома Ланистър седи неспокойно на Железния трон.",
                "_createdOn": 1617194128644,
                "rating":4,

            },
            "ff436770-76c5-40e2-b231-77409eda7a63": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a63",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "Сблъсък на крале - Книга 2 Игра на тронове",
                "author": "Джордж Р. Р. Мартин",
                "category": "fantasy",
                "summary": "Сказание, в което благородни девици пируват с безумци, където брат коварства срещу своя брат и където мъртвите се вдигат, за да тръгнат в нощта. Тук принцеса странства по света, предрешена като момче сираче; рицар на ума гласи отрова за вероломна чародейка; диваци се спущат от Лунната планина, за да опустошат плодните поля в низините. На фона на кръвосмешение и братоубийство, алхимия и насилствена смърт, цената на славата се мери в кръв. А плячката на победата може просто да се озове в ръце на мъже и жени, притежаващи най-хладната стомана… и най-студените сърца. Защото щом се сблъскат владетелите, трепери цялата земя.",
                "imageUrl": "/img/game-of-thrones-book2.jpg",
                "description": "Сблъсък на крале ни пренася в една удивителна, забравена земя на разгул и мъст, на чародейство и войни.",
                "_createdOn": 1617194128643,
                "rating":4,

            },
            "ff436770-76c5-40e2-b231-77409eda7a64": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a64",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "Тънкото изкуство да не ти пука",
                "author": "Марк Мейсън",
                "category": "psychology",
                "summary": "Повечето хора мечтаят за безоблачно щастие, вечна любов, привлекателна външност, вдъхновяваща и високоплатена работа... Накратко – живот, за който останалите да им завиждат. Социалните мрежи и консуматорската ни култура постоянно подхранват този фалшив идеал за щастие. Гарантираните начини да го постигнем обаче все повече заприличват на сапунен мехур, който авторът на тази книга спуква, като заявява смело: „Целият този сладникав позитивизъм и радостни врели-некипели за самопомощ наблягат най-вече на това, което ви липсва. Ключът към добрия живот е да не ви пука за това да трупате още и още, а да ви пука само за истинските и важните неща. Преди да осъзнаем това обаче, трябва да осмислим голяма част от неприятните истини и да имаме реалистични очаквания. Марк Менсън развенчава редица установени „житейски правила“ и прави доста шокиращи заявления, докато ни въвежда в тънкостите на изкуството да не ни пука.",
                "imageUrl": "/img/tankoto-izkustvo.jpg",
                "description": "Повечето хора мечтаят за безоблачно щастие, вечна любов, привлекателна външност, вдъхновяваща и високоплатена работа... Накратко – живот, за който останалите да им завиждат. Социалните мрежи и консуматорската ни култура постоянно подхранват този фалшив идеал за щастие.",
                "_createdOn": 1617194128618,
                "rating":4.5,

            },
            "ff436770-76c5-40e2-b231-77409eda7a01": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a31",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "Живот в скалите",
                "author": "Мария Лалева",
                "category": "best-seller",
                "summary": "Романът разказва за живота на „най-щастливия сирак“, отгледан от Михаил, Демир, Луиза, баба Настасия и гадателка. В отделните глави, носещи имената на героите, се разказва за преплитащите се съдби, за любовта и раздялата, за ангелите и демоните в човека.",
                "imageUrl": "/img/jivot-v-skalite.webp",
                "description": "За невъзможната любов, която като всеки ангел пази хората от тях самите, но е достатъчно близо, за да ги спаси, ако се наложи. ‘’На едни скали разстояние…“. Романът е сред безспорните бестселъри за 2020 година.",
                "_createdOn": 1617194128610,
                "rating":4.4,
            },
            "ff436770-76c5-40e2-b231-77409eda7a71": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a71",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "Твоето Его е врагът",
                "author": "Райън Холидей",
                "category": "psychology",
                "summary": "Тази книга съдържа неудобни истини. Тайната на успеха не е това, което хиляди съвременни гурута и звезди проповядват. Не – вселената не се върти около нас, и колкото и специални, талантливи и умни да сме, колкото и да вярваме и да желаем успеха, той може да ни подмине, или пък да ни споходи за кратко и след това да ни срине напълно, ако не сме нащрек. Тайната на успеха и постигането на хармония в живота се крие в способността ни да се справяме със своя най-коварен враг, собственото ни его.",
                "imageUrl": "/img/tvoeto-ego-e-vragyt.jpg",
                "description": "„Вдъхновяваща, макар и практична… Учи ни да управляваме и опитомяваме звяра в нас, така че да се фокусираме върху наистина значимото – да даваме най-доброто от себе си“",
                "_createdOn": 1617194128611,
                "rating":4.6,
            },
            "ff436770-76c5-40e2-b231-77409eda7a70": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a70",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "Изкуството да бъдеш спокоен",
                "author": "Райън Холидей",
                "category": "psychology",
                "summary": "В духа на своите предишни книги – „Твоето его е врагът“ и „Дарът на трудностите“ – той черпи от мъдростта на големите философски течения и религии и от историите на значими личности – от Марк Аврелий и Конфуций до Чърчил и Кенеди, за да подчертае огромното значение на спокойствието в човешкия живот. В една епоха, в която сме подложени на невероятен информационен шум и всяка криза по света бива преувеличавана и набивана в главите ни от медии, социални мрежи и тролове, това спокойствие е ключ към по-щастлив и смислен живот и противоотрова на смазващия ни стрес. Да приемем, че сме част от нещо по-голямо, да се възхитим на обикновените неща от живота и да се потопим в красотата на мига, да загърбим егото, да надмогнем себе си и да потърсим в покоя сила – именно на това изкуство ни учи тази книга. Това изкуство са владеели и мнозина от великите лидери, мислители, артисти и атлети, които в правилния момент са успявали да преодолеят собствения си темперамент, да се абстрахират напълно от напрежението, смущенията, страховете и съмнения и да направят това, което е нужно.",
                "imageUrl": "/img/izkustvoto-da-budesh-spokoen.jpg",
                "description": "„В тази епоха на изкуствено възмущение и постоянно разсейване способността да запазиш вътрешен покой е може би по-важна от всичко. Книгата на Райън Холидей възражда древната мъдрост и призовава за тих живот на фона на шумния и неспокоен свят.“",
                "_createdOn": 1617194128615,
                "rating":4.7,
            },
            "ff436770-76c5-40e2-b231-77409eda7a65": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a65",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "Всичко е прецакано",
                "author":"Марк Мейсън",
                "category": "psychology",
                "summary": "От автора на световната книжна сензация – Тънкото изкуство да не ти пука. Никога досега хората не са живели толкова добре: световната икономика процъфтява, образованието и здравните грижи стават все по-достъпни, масовото потребление на луксозни стоки бележи небивал растеж. В същото време се отчитат рекордни нива на неудовлетворение от живота, депресия и самоубийства. В този свят, където всичко изглежда прецакано, може ли да се надяваме на нещо добро? Още по-провокативен и безкомпромисен, Марк Менсън анализира кризите на съвременното общество и дава необичайно предложение за преодоляването им.",
                "imageUrl": "/img/vsichko-e-pretsakano.jpg",
                "description": "Вместо да търсиш надежда, опитай следното: Не се надявай. Но не се и отчайвай. Не се ласкай, че изобщо знаеш нещо. Точно тази сляпа, пламенна и емоционална увереност ни вкарва в подобна неразбория. Не се надявай на по-добро. Просто бъди по-добър.",
                "_createdOn": 1617194128641,
                "rating":4.4,
            },
            "ff436770-76c5-40e2-b231-77409eda7a69": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a70",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "Силата на навиците",
                "author":"Чарлс Дюиг",
                "category": "psychology",
                "summary": "След задълбочено проучване на навиците на отделни хора, на големи компании и дори на обществото като цяло, Чарлс Дюиг установява, че е достатъчно да променим един ключов навик, за да постигнем значима промяна. От книгата ще научите защо някои хора и компании не успяват да се променят, въпреки дългогодишните си усилия, докато други го правят сякаш за една нощ. Ще посетите лаборатории, където невролозите изучават как се формират навиците. Ще откриете до каква степен изградените навици са били решаващи за успеха на олимпийския рекордьор Майкъл Фелпс, на основателя на „Стaрбъкс“ Хауърд Шулц, на бореца за граждански права Мартин Лутър Кинг.",
                "imageUrl": "/img/silata-na-navitsite.jpg",
                "description": "Как да поставим ново начало в живота и бизнеса? Искате да промените живота си? Да започнете да тренирате редовно? Да се освободите от излишните килограми? Да откажете пушенето? Да развиете успешен бизнес? Как да го постигнете?",
                "_createdOn": 1617194128645,
                "rating":5,
            },
            "ff436770-76c5-40e2-b231-77409eda7a66": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a66",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "Малкият принц",
                "author": "Антоан дьо Сент Екзюпери",
                "category": "best-seller",
                "summary": "Представи си, че си се изгубил в необятната африканска пустиня. И че изведнъж пред теб се появява момченце със златни коси, което настоява да му нарисуваш овца. Това е малкият принц, който идва от далечна планета с размерите на къща. Той задава много въпроси и се опитва да разбере странния свят на възрастните. Заедно ще се впуснете в необикновено приключение. За да научите тайната на живота: че „...най-хубавото се вижда само със сърцето. Най-същественото е невидимо за очите“",
                "imageUrl": "/img/little-prince.jpg",
                "description": "Представи си, че си се изгубил в необятната африканска пустиня. И че изведнъж пред теб се появява момченце със златни коси, което настоява да му нарисуваш овца. Това е малкият принц, който идва от далечна планета с размерите на къща.",
                "_createdOn": 1617194128642,
                "rating":5,
            },
            "1840a313-225c-416a-817a-9954d4609f7c": {
                "_id":"1840a313-225c-416a-817a-9954d4609f7c",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "Хари Потър и Философският камък",
                "author": "Джоан Роулинг",
                "category": "fantasy",
                "summary": "Хари Потър не знае нищо за „Хогуортс“ до момента, в който множество мистериозни писма започват да се изсипват в дома на семейство Дърсли на улица „Привит Драйв“. Адресирани до него, надписани със зелено мастило върху жълтеникав пергамент и запечатани с лилав печат, те бързо будят подозрението на противните леля и чичо на момчето и са конфискувани от тях. Няколко дни по-късно, навръх единадесетия рожден ден на Хари, великан с очи, блестящи като черни бръмбари, на име Рубиъс Хагрид пристига с невероятни новини – Хари Потър е магьосник, записан в Училището за магия и вълшебство „Хогуортс“! Едно удивително приключение е на път да започне…",
                "imageUrl": "/img/harry-potter-philosophy-stone.jpg",
                "description": "Представете си, че сте прекарали първите 10 години от своя живот без родители, живеейки под стълбите в дома на семейство, което ви мрази. И на единайсетия си рожден ден откривате, че сте истински магьосник! Точно това се случва с Хари Потър в този пленяващ забавен роман.",
                "_createdOn": 1617194210928,
                "rating":5,
            },
            "126777f5-3277-42ad-b874-76d043b069cb": {
                "_id": "126777f5-3277-42ad-b874-76d043b069cb",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Хари Потър и Стаята на тайните",
                "author": "Джоан Роулинг",
                "category": "fantasy",
                "summary": "Много пъти Хари беше на ръба на решението да отвори с магия кафеза на Хедуиг и да я изпрати с писма при Рон и Хърмаяни, но не си заслужаваше риска. На невръстни магове не се позволяваше да използват магии извън училище. Но Хари не беше казал това на семейство Дърсли, защото знаеше, че само ужасът да не ги превърне и тримата в торни бръмбари ги възпираше да не го заключат и него в килера под стълбището при магическата му пръчка и метлата. През първите няколко седмици след завръщането си Хари се забавляваше да си мърмори безсмислици под носа, за да види как Дъдли изчезва от стаята с максималната бързина, която му позволяваха дебелите крака. Но дългото мълчание на Рон и Хърмаяни го бе накарало да се чувства толкова изолиран от света на вълшебствата, че вече дори не му правеше удоволствие да дразни Дъдли. Ето че сега Рон и Хърмаяни бяха забравили дори рождения му ден… Какво ли не би дал за някаква вест от „Хогуортс“! От който и да е магьосник… Щеше да се радва да мерне дори най-страшния си враг Драко Малфой, само и само да се убеди, че всичко досега не е било сън.",
                "imageUrl": "/img/harry-potter-book2.jpg",
                "description": "Изборът, който правим, Хари, говори много по-красноречиво за същността ни, отколкото нашите способности ",
                "_createdOn": 1617194295474,
                "rating":4.9,
            },
            "126777f5-3277-42ad-b874-76d043b069cc": {
                "_id": "126777f5-3277-42ad-b874-76d043b069cc",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Хари Потър и затворникът от Азкабан",
                "author": "Джоан Роулинг",
                "category": "fantasy",
                "summary": "В третата книга от поредицата за Хари Потър загадките стават все повече и все по-сложни... Около Хари се явяват зловещи призрачни създания, а затворник беглец, обвинен в масово убийство, се опитва да се добере до него. Но малкият магьосник не се предава, напротив - започва специално обучение за самозащита. Неговите лични страхове и кошмари се заплитат в горещо кълбо и разплитането им ще разкрие истината за част от историята на училището и някои от най-добрите му възпитаници... Тази истина е красива и страшна!",
                "imageUrl": "/img/harry-potter-book3.jpg",
                "description": "Третата книга от поредицата за магьосника Хари Потър... Хари Потър беше твърде необикновено момче. Лятната ваканция за него беше най-омразният от всички периоди на годината. Освен това страшно му се искаше да си пише домашните, но се налагаше да го прави тайно, в дълбоката тъмнина на нощта. И най-важното - Хари беше магьосник...",
                "_createdOn": 1617194295475,
                "rating":4.9,
            },
            "126777f5-3277-42ad-b874-76d043b069ce": {
                "_id": "126777f5-3277-42ad-b874-76d043b069ce",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Сблъсък на крале - Книга 1 Игра на тронове",
                "author": "Джордж Р. Р. Мартин",
                "category": "fantasy",
                "summary": "Докато създаденият с богато въображение свят на Джордж Р. Р. Мартин необратимо се приближава към своята десетгодишна зима, се влошава не само времето, а и войната. На север крал Джофри от дома Ланистър седи неспокойно на Железния трон. С помощта на едно грубовато момиче Джайм Ланистър, Кралеубиеца, се измъква от затвора си в Речен пад, за да осигури освобождаването на пленничките на Джофри, сестрите на Роб Старк - Аря и Санса. Междувременно на юг кралица Денерис се опитва на наложи претенциите си над различните тронове с помощта на армия от евнуси. На фона на кръвосмешение и братоубийство, алхимия и насилствена смърт, цената на славата се мери в кръв. А плячката на победата може просто да се озове в ръце на мъже и жени, притежаващи най-хладната стомана... и най-студените сърца. Защото щом се сблъскат владетелите, трепери цялата земя.",
                "imageUrl": "/img/game-of-thrones-book1.jpg",
                "description": "Сблъсък на крале ни пренася в една удивителна, забравена земя на разгул и мъст, на чародейство и войни.",
                "_createdOn": 1617194295476,
                "rating":4.8,
            },
            "126777f5-3277-42ad-b874-76d043b069za": {
                "_id": "126777f5-3277-42ad-b874-76d043b069za",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Пипи дългото чоарапче",
                "author": "Астрид Линдгрен",
                "category": "kids-book",
                "summary": "Пипи живее съвсем сама в една стара къща, наречена Вила Вилекула. Тя няма нито майка, нито татко, но това ни най-малко не я тревожи, защото си има кон и маймунка, а в съседната къща живеят две нейни другарчета - Томи и Аника. Пипи е най-силното момиче в света. Стига да поиска, тя може да вдигне коня с едната си ръка. Освен това е и богата - има цяла торба, пълна със златни парички. Всеки ден Пипи, Томи и Аника ограят заедно. В тази книга вие ще научите за всички приключения, които тримата изживяват. Астрид Линдгрен",
                "imageUrl": "/img/pipi.jpg",
                "description": "Скъпи приятели, При вас идва едно шведско момиче, което се казва Пипи Дългото чорапче. Тя е доста чудата, но аз се надявам, че въпреки това вие ще я обикнете. Астрид Линдгрен",
                "_createdOn": 1617194295421,
                "rating":4.7,
            },
            "126777f5-3277-42ad-b874-76d043b069zb": {
                "_id": "126777f5-3277-42ad-b874-76d043b069zb",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Питър Пан",
                "author": "Джеймс Матю Бари",
                "category": "kids-book",
                "summary": "Сър Джеймс Матю Бари е английски писател, журналист и драматург. Роден е през 1860 го-дина в Киримюр, Шотландия. Автор е на много романи, повести и пиеси. През 1904 година в Лондон на театрална сцена е поставена пиесата му „Питър Пан”, която след авторска преработка през 1911 година е издадена като книга. Преиздавана стотици пъти, филмирана и играна по цял свят, тя му носи световна слава и поставя името му в златната съкровищница на детската литература. Италианският художник Либико Марайа е илюстрирал всепризнати шедьоври на литературата за деца, създавайки сцени с рядка живописна красота. Като майстор илюстратор притежава способността точно да се придържа към съдържанието на текста и великолепно да го допълва. Творчеството му има международна известност – илюстрираните от него книги са познати и обичани в целия свят. Книгата „Питър Пан“ с негови илюстрации се издава за първи път в България.",
                "imageUrl": "/img/peter-pan.jpg",
                "description": "За първи път в България книгата “Питър Пан” излиза с най-красивите илюстрации на италианския майстор художник Либико Марайа. Вълшебството на красивите илюстрации идва при вас във вида на оригиналното италианско издание.",
                "_createdOn": 1617194295422,
                "rating":4.8,
            },
            "126777f5-3277-42ad-b874-76d043b069zc": {
                "_id": "126777f5-3277-42ad-b874-76d043b069zc",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Маша и мечока",
                "author": "Егмонт",
                "category": "kids-book",
                "summary": "В тази прекрасна книга ще намерите няколко весели истории – как Маша се пързаляла с кънки, как ходила на училище и как охранявала зеленчуковата градина на Мечока от хитрия Заек. Както знаете, палавницата се справя добре с всичко – особено когато добрият Мечок й помага.",
                "imageUrl": "/img/masha-and-the-bear.jpg",
                "description": "Приключенията на Маша и Мечока продължават! Очакват ви любими герои, забавни случки и великолепни илюстрации.",
                "_createdOn": 1617194295423,
                "rating":4.5,
            },
            "126777f5-3277-42ad-b874-76d043b069zd": {
                "_id": "126777f5-3277-42ad-b874-76d043b069zd",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Патиланци",
                "author": "Ран Босилек",
                "category": "kids-book",
                "summary": "В книгата е представен незабравимият герой на Ран Босилек Патиланчо. Чрез неговите изпълнени със заразителен хумор писма до Смехурко писателят рисува неповторимия детски свят, в който забавните игри и смехът често са последвани от сълзи, а лудориите на малките палавници водят до наказания от страна на възрастните.",
                "imageUrl": "/img/patilantsi.jpg",
                "description": "Веселите приключения на любопитните, находчиви и жизнерадостни патиланци и тяхната строга, но любяща баба Цоцолан.",
                "_createdOn": 1617194295424,
                "rating":4.5,
            },
            "126777f5-3277-42ad-b874-76d043b069ze": {
                "_id": "126777f5-3277-42ad-b874-76d043b069ze",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Хей, мамо... Колко голям е светът?",
                "author": "Сабине Болман",
                "category": "kids-book",
                "summary": "Стопляща сърцето история за малко, любопитно котараче, задаващо големи въпроси, и за неговата любяща майка котка, даваща мъдри отговори. Когато разбереш, че светът е наистина доста далеч и високо, и дълбоко, и някак си навсякъде, изникват още много въпроси. Любовта е толкова близо и в същото време се простира по-далеч, отколкото можеш да си представиш!",
                "imageUrl": "/img/hey-mam.jpg",
                "description": "За всички любители на картинни книги и котки, оригинален подарък за любопитни изследователи на света. Ода на любознателността... и любовта.",
                "_createdOn": 1617194295425,
                "rating":4.8,
            },
            "126777f5-3277-42ad-b874-76d043b069zf": {
                "_id": "126777f5-3277-42ad-b874-76d043b069zf",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Историята в комикс - Мечо Пух",
                "author": "Сабине Болман",
                "category": "kids-book",
                "summary": "Любимата история на малки и големи, разказана по нов, атрактивен начин. Впуснете се в незабравимо приключение с комикс адаптацията на Мечо Пух. Проследете приключенията на Пух и приятелите от Голямата гора.",
                "imageUrl": "/img/pooh.jpeg",
                "description": "Любимата история на малки и големи, разказана по нов, атрактивен начин.",
                "_createdOn": 1617194295426,
                "rating":4.8,
            },
            "126777f5-3277-42ad-b874-76d043b069zk": {
                "_id": "126777f5-3277-42ad-b874-76d043b069zk",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Цифрова крепост",
                "author": "Дан Браун",
                "category": "fiction",
                "summary": "Когато непобедимият компютър на Агенцията за Национална Сигурност за разбиване на шифри се сблъсква с мистериозно кодирано съобщение, с което не може да се справи, Агенцията се обръща към старшия си криптолог Сюзан Флечър - гениално умна и красива математичка. И тя разкрива нещо, което разтърсва коридорите на властта. АНС е в опасност, но не от оръдия или бомби, а заради сложен код, който ако стане публично достояние, ще постави под заплаха устоите на американското разузнаване.",
                "imageUrl": "/img/cifrova_krepost.jpg",
                "description": "Едно анонимно „Благодаря“ поставя началото на хаоса. „Цифрова крепост“ е най-добрият и най-реалистичен технотрилър от години. Способността на Дан Браун да обрисува в естествени краски сивата зона, разделяща демократичните свободи от националната сигурност... е впечатляваща!“, Пъблишърс Уикли",
                "_createdOn": 1617194295428,
                "rating":5,
            },
            "126777f5-3277-42ad-b874-76d043b069zl": {
                "_id": "126777f5-3277-42ad-b874-76d043b069zl",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Шифърът на Леонардо",
                "author": "Дан Браун",
                "category": "fiction",
                "summary": "Докато е в командировка в Париж, харвардският професор по история на символите Робърт Лангдън е събуден посред нощ: един възрастен уредник в Лувъра е убит в музея. Край трупа му полицията открива озадачаващ шифър. Докато се опитва да го разгадае, Лангдън с удивление открива, че той води до пътека от кодове, скрити в творбите на Леонардо- кодове, изложени пред очите на всички, и все пак находчиво скрити от художника.",
                "imageUrl": "/img/leonardo.jpg",
                "description": "Впуснете се в един от най-интригуващите трилъри на XX век и разкрийте пазени с векове послания, скрити в произведения на гениалния ренесансов художник Леонардо да Винчи!",
                "_createdOn": 1617194295429,
                "rating":4.7,
            },
            "126777f5-3277-42ad-b874-76d043b069zm": {
                "_id": "126777f5-3277-42ad-b874-76d043b069zm",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Шестото клеймо",
                "author": "Дан Браун",
                "category": "fiction",
                "summary": "Вендета - най могъщата секретна организация, -илюминати- съществувала на Земята, изплува от мрака, за да изпълни заключителната фаза от легендарната си вендета срещу най-омразния си враг - Католическата църква. Тайнствен символ жигосан върху гърдите на убит физик, дава знак за появата на демонична сила, която жадува реванш. Ново оръжие с опустушителна мощ е заложено в самото сърце на Ватикана. Специалистът по древни символи Робърт Лангдън предприема крайно рискован воаяж през тайни крипти и опасни катакомби, за да открие четиривековен път от древни символи, който го отвежда към забравено илюминатско скривалище, където го очаква една мрачна истина.",
                "imageUrl": "/img/shestoto-kleymo.jpg",
                "description": "Тайнствен символ жигосан върху гърдите на убит физик, дава знак за появата на демонична сила, която жадува реванш. Ново оръжие с опустушителна мощ е заложено в самото сърце на Ватикана",
                "_createdOn": 1617194295430,
                "rating":4.8,
            },
            "126777f5-3277-42ad-b874-76d043b069zn": {
                "_id": "126777f5-3277-42ad-b874-76d043b069zn",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Изгубеният символ",
                "author": "Дан Браун",
                "category": "fiction",
                "summary": "Роман, в който Робърт Лангдън отново разкрива невероятни тайни... На друг таен орден... На друго място... С друг,още по-голям залог... Написан от Дан Браун със същия невероятен мащаб, стил и език. Със същия невероятен динамизъм.",
                "imageUrl": "/img/the-lost-symbol.jpg",
                "description": "Забележителна книга! Вещо проучена и написана, с главоломно действие, 'Изгубеният символ' още веднъж показва защо Дан Браун е най-четеният автор на трилъри в света.",
                "_createdOn": 1617194295431,
                "rating":4.8,
            },
            "126777f5-3277-42ad-b874-76d043b069zo": {
                "_id": "126777f5-3277-42ad-b874-76d043b069zo",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Животът и приключенията на Робинзон Крузо",
                "author": "Даниъл Дефо",
                "category": "fiction",
                "summary": "Настоящата книга разкрива животът и необикновените, изумителни приключения на моряка Робинзон Крузо, родом от Йорк, който прекарва двайсет и осем години на безлюден остров край бреговете на Америка близо до устието на великата река Ориноко, след като претърпява корабокрушение, в което загива целият екипаж и единствено той остава жив. В книгата ще прочетете и разказ за по-нататъшното му необикновено избавление от безпощадни пирати... Всичко описано от него самия. Описанието е поднесено скромно, с подобаващо вглъбяване и с праведни тълкувания на събитията, както постъпват винаги мъдрите люде, та останалите да се поучат от дадения пример и да се отдаде дължимата почит на мъдрото провидение, колкото и разнообразни да са нашите преживявания, сполетяващи ни по своя воля.",
                "imageUrl": "/img/robinzon-kruzo.jpg",
                "description": "Благодарение на гениалното си отношение към факта Даниъл Дефо постига ефекти, възможни единствено за великите майстори на описателната проза.",
                "_createdOn": 1617194295432,
                "rating":4.6,
            },
            "126777f5-3277-42ad-b874-76d043b069bb": {
                "_id": "126777f5-3277-42ad-b874-76d043b069bb",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Сули",
                "author": "Джон Гришам",
                "category": "fiction",
                "summary": "През лятото на седемнайсетата си година Самуел Сулеймон получава шанса на живота си: отпътува за Съединените щати със своите съотборници от Южен Судан, за да участва в селекционен баскетболен турнир. Шансът да играе пред десетки треньори на колежански отбори за него е сбъдната мечта. Сули е великолепен атлет: бърз, пъргав, с невероятен вертикален отскок. Някои елементи от играта му обаче се нуждаят от сериозно усъвършенстване, затова той не впечатлява американските селекционери. По време на турнира Сули получава трагична новина: в Южен Судан бушува гражданска война, а родното му село е нападнато и ограбено от бунтовници. Баща му е мъртъв, сестра му е изчезнала, майка му и двамата му по-малки братя са в бежански лагер.",
                "imageUrl": "/img/sully.jpg",
                "description": "В своя първи роман за света на баскетбола Джон Гришам ни отвежда в спортната вместо в съдебната зала. Самуел Сулеймон, по прякор Сули, е нешлифован диамант, суров талант с големи мечти за звездната лига… и още по-големи предизвикателства, които трябва да преодолява извън игрището.",
                "_createdOn": 1617194295200,
                "rating":5,
            },
            "126777f5-3277-42ad-b874-76d043b069zp": {
                "_id": "126777f5-3277-42ad-b874-76d043b069zp",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Бяг - автобиография на Рони О'Съливан",
                "author": "Рони О'Съливан",
                "category": "autobiography",
                "summary": "Освен че е играчът с най-много спечелени титли по снукър, за мнозина Рони ОСъливан е и най-талантливият. И определено – предизвикващ най-голям интерес като личност. Той прави първия си сенчъри брейк, когато е на десет години, и няма голям турнир, който да не е спечелил поне веднъж. В същото време Рони е отказвал участия повече от всеки друг играч, неведнъж се е оттеглял по време на състезание, което шесткратният световен шампион Стив Дейвис определя като „непочтително“, и е имал многобройни разправии със съдии заради непристойно поведение и цветист език по време на игра. Автобиографията му хвърля светлина върху върху един период, за който само най-близките на Рони знаят. От 2003 г. насам възходите и паденията в живота му трудно могат да останат незабелязани от публиката. В този период той печели всичко от Welsh Open до Световното първенство в Шефилд. Същевременно се бори с депресията, личните си демони и нарастващите съмнения на спонсори и фенове, че ще се окаже „пълен провал“ като играч и като човек.",
                "imageUrl": "/img/run.jpg",
                "description": "Снукърът – моята игра. Спортът, който понякога презирам толкова много, че не мога дори да погледна към щеката; спортът, който обаче се превърна и в любовта на живота ми.",
                "_createdOn": 1617194295199,
                "rating":4.5,
            },
            "126777f5-3277-42ad-b874-76d043b069zq": {
                "_id": "126777f5-3277-42ad-b874-76d043b069zq",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Стивън Джерард. Моята история",
                "author": "Стивън Джерард",
                "category": "autobiography",
                "summary": "Джерард е от онези момчета, чийто живот тече в една-единствена посока. Тази на неговия клуб! „Ливърпул“ е философията, която Стиви Джи наследява и безусловно приема от своя баща, осъзнавайки, че тя е неговата пътеводна светлина, независимо дали е свързан пряко с отбора на своето сърце, или е просто един от онези милиони по земното кълбо, носещи частичка от Червената магия в себе си. В „Моята история” бившият капитан на английския национален отбор е болезнено откровен. Стивън не се притеснява да разкаже за морето от сълзи след онова злокобно подхлъзване в двубоя с „Челси“, което на практика лиши „Ливърпул“ от така жадуваната шампионска титла. За силната му привързаност и възхищение не само от детските му местни герои, но и от негови съотборници като Фернандо Торес и Луис Суарес, акостирали на „Анфийлд“ от съвсем различни светове. Джерард не скрива дори момента на ярост, когато бил готов да зашлеви шикалкавещия мениджър Брендън Роджърс...",
                "imageUrl": "/img/my-story.jpg",
                "description": "„Моята история” дава поредния отговор защо клуб като „Ливърпул“, който не е стъпвал на шампионския връх в Англия повече от 25 години",
                "_createdOn": 1617194295198,
                "rating":4.8,
            },
            "126777f5-3277-42ad-b874-76d043b069zz": {
                "_id": "126777f5-3277-42ad-b874-76d043b069zz",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Димитър Бербатов - По моя начин",
                "author": "Димитър Бербатов",
                "category": "autobiography",
                "summary": "Моята история не е измислица, написана е в съавторство с истинския живот, и както често става в него, някои от ситуациите нямат щастлив край! Но това е само на пръв поглед, защото трудностите всъщност са хубаво нещо – те те карат да се развиваш. Вярвам, че ще ти бъде интересно, защото животът понякога е по-абсурден и забавен и от най-голямата измислица. А дали книгата ще те научи на нещо и ще те вдъхнови, това вече зависи от теб самия. „Понякога, когато вземаш решения като мениджър, можеш да допуснеш грешки. Именно такъв беше случаят, когато играхме финала в Шампионската лига с „Барселона“ на „Уембли“… Все още виждам пред очите си разочарованието на лицето на Димитър. Това е нещо, за което аз винаги ще съжалявам – той заслужаваше своето място в отбора!” Сър Алекс Фъргюсън",
                "imageUrl": "/img/dimitar-berbatov.jpg",
                "description": "Официална автобиография на Димитър Бербатов, играч на ЦСКА, „Байер” (Леверкузен), „Тотнъм”, „Фулъм”, „Монако” и „Манчестър Юнайтед”.",
                "_createdOn": 1617194295198,
                "rating":4.7,
            },
            "126777f5-3277-42ad-b874-76d043b069ab": {
                "_id": "126777f5-3277-42ad-b874-76d043b069ab",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Христо Стоичков - Историята",
                "author": "Христо Стоичков и Владимир Памуков",
                "category": "autobiography",
                "summary": "Някои истории са прекалено истински, за да се разказват. Но аз реших да опитам.Имах щастието животът да ме изстреля нагоре и да сбъдна голямата си детска мечта. Колко високо стигнах? Вие ще кажете, защото всеки си има своя Еверест. Знам само, че днес, когато погледна надолу, за да видя откъде съм тръгнал, все още ми се завива свят. Напоследък всички пишат. А за да не кажете, че футболистите пишат с краката си, аз избрах да направим тази книга със спортния журналист Владимир Памуков. Реално, ако има нещо, което той не знае за мен или за Четвъртите в света, то явно не си е струвало да го знае или просто... не е искал да го знае. Така че от мен разказа, а от Владо – писането.",
                "imageUrl": "/img/stoichkov.jpg",
                "description": "Ако не сме се справили, се надявам поне да оцените факта, че имахме смелостта да опитаме. Ако пък сме успели... пак ще се намерят и такива, които ще ни оплюят. При мен е така – няма полутонове. Свиквайте и се забавлявайте! Това е моята истина, моята история.",
                "_createdOn": 1617194295198,
                "rating":4.6,
            },
            "126777f5-3277-42ad-b874-76d043b069ac": {
                "_id": "126777f5-3277-42ad-b874-76d043b069ac",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "1984 - Джордж Оруел",
                "author": "Джордж Оруел",
                "category": "history-and-politics",
                "summary": "Уинстън Смит работи в Министерството на истината в Лондон, град от държавата Океания. Неговото служебно задължение е да пренаписва новини от стари вестници, за да станат в „съответствие с представяните от установената власт исторически факти, защото: „Който владее миналото, той владее и бъдещето. Който владее настоящето, владее миналото“. ГОЛЕМИЯТ БРАТ ТЕ НАБЛЮДАВА гласи надписът под безброй портрети, чрез видеоекрани всички граждани са под постоянен надзор, а Полицията на мисълта следи за всяко отклонение от официалната идеология, чиито основни постулати са:",
                "imageUrl": "/img/1984.jpg",
                "description": "„1984“ не трябва да се разглежда като изобличение на социализма. Тя изобразява перверзията, до която води централизираната икономика, перверзия, реализирана успешно при комунизма и фашизма.“, Джордж Оруел",
                "_createdOn": 1617194295197,
                "rating":4.5,
            },
            "126777f5-3277-42ad-b874-76d043b069ad": {
                "_id": "126777f5-3277-42ad-b874-76d043b069ad",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Безумие и слава",
                "author": "Тим Уайнър",
                "category": "history-and-politics",
                "summary": "Тим Уайнър, носител на „Пулицър“, този път насочва острото си перо към десетилетната борба между двете световни суперсили – САЩ и СССР, както и към новото прераждане на съветската империя под ръководството на амбициозния Владимир Путин. Шпионаж, саботажи, дипломация и фалшиви новини – всички тези оръжия на политическата война се използват от 1945 до наши дни, като успехът далеч по-често е на страната на руснаците. Уайнър показва как новият агресивен подход на Путин довежда до пряко вмешателство в изборите в Америка и до успех на удобен за него президент. Това е триумф, пред който дори най-големите постижения на съветското разузнаване – а те не са никак малки – бледнеят.",
                "imageUrl": "/img/bezumie-i-slava.jpg",
                "description": "„Безумие и слава“ е история на близкото минало с фокус върху настоящето и с призив за бъдещето – политическата война може да нанесе огромни поражения без нито един изстрел. И залозите в нея стават все по-големи, а демокрациите – все по-уязвими пред своите безмилостни авторитарни врагове.",
                "_createdOn": 1617194295196,
                "rating":4.6,
            },
            "126777f5-3277-42ad-b874-76d043b069ae": {
                "_id": "126777f5-3277-42ad-b874-76d043b069ae",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Възходът на Запада - том 1",
                "author": "Уилям Макнийли",
                "category": "history-and-politics",
                "summary": "Възходът на Запада е едно от най-важните исторически изследвания на развитието на човешката цивилизация, запазило своята актуалност и до днес. Авторът представя световната история като единно цяло - в духа на концепцията за взаимопроникването на културите, разработена от американските антрополози през 30-те години на XX век. Според него контактът с чужди култури е основен двигател на социалните промени. Именно взаимодействията между отделните цивилизации определят посоката на историческото развитие. Макнийл доказва убедително теорията си с живо описание на ключови моменти от световната история.",
                "imageUrl": "/img/vazhodat-na-zapada.jpg",
                "description": "Книгата на Уилям Макнийл Възходът на Запада, известна с амбициозния хронологически обхват и научна прецизност, печели Националната награда за историческо изследване през 1964 г. ",
                "_createdOn": 1617194295195,
                "rating":4.7,
            },
            "126777f5-3277-42ad-b874-76d043b069af": {
                "_id": "126777f5-3277-42ad-b874-76d043b069af",
                "_ownerId": "847ec027-f659-4086-8032-5173e2f9c93a",
                "title": "Биография на Зеленски - От слуга до президент на народа",
                "author": "Режи Жанте, Стефан Сиоан",
                "category": "history-and-politics",
                "summary": "Роден в семейството на родители евреи през 1978 г., Володимир Зеленски израства в Кривой Рог с баща, който е и ръководител на катедрата по кибернетика и компютърен хардуер в Криворогския икономически и технологичен университет, и майка инженер. Бъдещият политик обаче решава да преследва различна кариера и още на 17-годишна възраст се присъединява към съветското комедийно състезание KVN в ефира на Украйна. Участвайки в така наречената Основна лига на предаването, през 1997 г. той печели надпреварата, а с отбора си Kvartal 95 създава едноименна телевизионна продуцентска компания. В Kvartal 95 Studio, кръстена на централна част от родния Кривой Рог, през 2003 г. започва работа като сценарист и съпругата на Володимир - Олена.",
                "imageUrl": "/img/zelenski.jpg",
                "description": "За света той е президент на Украйна, изправен пред криза, но доскоро малко хора извън Украйна са знаели, че Володимир Зеленски успява да спечели вота на своя народ с комедийната си кариера.",
                "_createdOn": 1617194295194,
                "rating":4.4,
            },
        },
        favourites: {
        
        },
        comments: {
            
        }
    };
    var rules$1 = {
        users: {
            ".create": false,
            ".read": [
                "Owner"
            ],
            ".update": false,
            ".delete": false
        }
    };
    var settings = {
        identity: identity,
        protectedData: protectedData,
        seedData: seedData,
        rules: rules$1
    };

    const plugins = [
        storage(settings),
        auth(settings),
        util$2(),
        rules(settings)
    ];

    const server = http__default['default'].createServer(requestHandler(plugins, services));

    const port = 3030;
    server.listen(port);
    console.log(`Server started on port ${port}. You can make requests to http://localhost:${port}/`);
    console.log(`Admin panel located at http://localhost:${port}/admin`);

    var softuniPracticeServer = {

    };

    return softuniPracticeServer;

})));
