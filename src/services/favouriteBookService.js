import * as request from './requester';

const baseUrl = 'http://localhost:3030/data';

export const addFavouriteBook = (bookId) => request.post(`${baseUrl}/favourites`, { bookId });

export const getMyFavouritesByBookId = (bookId, userId) => request.get(`${baseUrl}/favourites?where=bookId%3D%22${bookId}%22%20and%20_ownerId%3D%22${userId}%22&count`);

export const removeFavourite = (newId) => request.del(`${baseUrl}/favourites/${newId}`);