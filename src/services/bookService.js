import * as request from './requester';

const baseUrl = 'http://localhost:3030/data/books';

export const getAll = () => request.get(`${baseUrl}`);

export const getByCategory = (bookCategory) => request.get(`${baseUrl}?where=category%3D%22${bookCategory}%22`);

export const getNewest = () => request.get(`${baseUrl}?sortBy=_createdOn%20desc`);

export const getById = (bookId) => request.get(`${baseUrl}/${bookId}`);

export const create = (bookData) => request.post(baseUrl, bookData);

export const edit = (bookId, bookData) => request.put(`${baseUrl}/${bookId}`, bookData);