import * as request from './requester';

const baseUrl = 'http://localhost:3030/data';

export const getMyBooks = (userId) => request.get(`${baseUrl}/books?where=_ownerId%3D%22${userId}%22`);

export const getAll = () => request.get(`${baseUrl}/books`);

export const getByCategory = (bookCategory) => request.get(`${baseUrl}/books?where=category%3D%22${bookCategory}%22`);

export const getNewest = () => request.get(`${baseUrl}/books?sortBy=_createdOn%20desc`);

export const getById = (bookId) => request.get(`${baseUrl}/books/${bookId}`);

export const create = (bookData) => request.post(`${baseUrl}/books`, bookData);

export const edit = (bookId, bookData) => request.put(`${baseUrl}/books/${bookId}`, bookData);

export const favouriteBook = (bookId) => request.post(`${baseUrl}/favourites`, { bookId });

export const getMyFavouritesByBookId = (bookId, userId) => request.get(`${baseUrl}/favourites?where=bookId%3D%22${bookId}%22%20and%20_ownerId%3D%22${userId}%22&count`);

export const removeFavourite = (newId) => request.del(`${baseUrl}/favourites/${newId}`);
