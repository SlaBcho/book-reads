export const request = async (method, url, data) => {
    try{
        const userData = localStorage.getItem('auth');
        const auth = JSON.parse(userData || '{}');

        let headers = {};

        if(auth.accessToken) {
            headers['X-Authorization'] = auth.accessToken;
        }

        let buildRequest;

        if(method === 'GET') {
            buildRequest = fetch(url, {headers});
        } else {
            buildRequest = fetch(url, {
                method,
                headers: {
                    ...headers,
                    'content-type':'application/json'
                },
                body: JSON.stringify(data)
            });
        }
        
        const response = await buildRequest;

        const result = await response.json();
        
        return result;
    } catch (error) {

    }

};

export const get = request.bind({}, 'GET');
export const post = request.bind({}, 'POST');
export const put = request.bind({}, 'PUT');
export const del = request.bind({}, 'DELETE');
