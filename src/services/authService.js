import * as request from './requester';
const baseUrl = 'http://localhost:3030/users';


export const login = (email, password) =>
    request.post(`${baseUrl}/login`, { email, password });

export const logout =  () => request.get(`${baseUrl}/logout`);

export const register = (email, password,repeatPassword) =>
    request.post(`${baseUrl}/register`, { email, password, repeatPassword });


