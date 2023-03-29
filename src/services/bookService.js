import * as request from './requester';

const baseUrl = 'http://localhost:3030/data';

export const getMyBooks = (userId) => request.get(`${baseUrl}/books?where=_ownerId%3D%22${userId}%22`);

export const getAll = () => request.get(`${baseUrl}/books`);

export const getNewest = () => request.get(`${baseUrl}/books?sortBy=_createdOn%20asc`);

export const getByCategory = (bookCategory) => request.get(`${baseUrl}/books?where=category%3D%22${bookCategory}%22`);

export const getById = (bookId) => request.get(`${baseUrl}/books/${bookId}`);


export const create = (bookData) => request.post(`${baseUrl}/books`, bookData);

export const edit = (bookId, bookData) => request.put(`${baseUrl}/books/${bookId}`, bookData);

export const remove = (bookId) => request.del(`${baseUrl}/books/${bookId}`);


export const searchBook = (query) => request.get(`${baseUrl}/books?where=title%20LIKE%20%22${query}%22`);

export const pagination = (skip) => request.get(`${baseUrl}/books?offset=${skip}&pageSize=12`);