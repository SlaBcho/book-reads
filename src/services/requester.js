export const request = async (method, url, data) => {
    // try {
        const userData = localStorage.getItem('auth');
        const auth = JSON.parse(userData || '{}');

        const options={
            method,
            headers:{}
        };

        // let headers = {};

        if (auth.accessToken) {
            options.headers['X-Authorization'] = auth.accessToken;
        }

        // let buildRequest;

        if(data !== undefined) {
            options.headers['Content-Type'] = 'application.json';
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (response.status === 204) {
                return response;
            }

            const data = await response.json();

            if(response.ok === false) {
                if(response.status === 403) {
                    localStorage.clear();
                }
                throw new Error(data.message);
            }

            return data;
        } catch(err) {
            alert(err.message);
            throw err;
        }
    //     if (method === 'GET') {
    //         buildRequest = fetch(url, { headers });
    //     } else {
    //         buildRequest = fetch(url, {
    //             method,
    //             headers: {
    //                 ...headers,
    //                 'content-type': 'application/json'
    //             },
    //             body: JSON.stringify(data)
    //         });
    //     }

    //     const response = await buildRequest;

    //     const result = await response.json();

    //     return result;
    // } catch (error) {

    // }
};

export const get = request.bind({}, 'GET');
export const post = request.bind({}, 'POST');
export const put = request.bind({}, 'PUT');
export const del = request.bind({}, 'DELETE');
