export const request = async (method, url, data) => {
    
    const options = {
        method,
        headers: {}
    };

    const userData = localStorage.getItem('auth');
    const auth = JSON.parse(userData || '{}');

    if (auth.accessToken) {
        options.headers['X-Authorization'] = auth.accessToken;
    }

    if (data !== undefined) {
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
            if (response.status === 403) {
                localStorage.removeItem('auth');
            }
            throw new Error(data.message);
        }

        return data;

    } catch (err) {
        throw err;
    }
};

export const get = request.bind({}, 'GET');
export const post = request.bind({}, 'POST');
export const put = request.bind({}, 'PUT');
export const del = request.bind({}, 'DELETE');
