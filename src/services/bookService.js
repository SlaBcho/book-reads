import * as request from './requester';

const baseUrl = 'http://localhost:3030/data/books';
// http://localhost:3030/data/books?where=category%3D%22fantasy%22

export const getAll = () => request.get(`${baseUrl}`);

export const getById = (gameId) => request.get(`${baseUrl}/${gameId}`);

export const create = (gameData) => request.post(baseUrl, gameData);

export const edit = (gameId, gameData) => request.put(`${baseUrl}/${gameId}`, gameData);