import * as request from './requester';

const baseUrl = 'http://localhost:3030/data';

export const postComment = (bookId, comment, username, rating) => request.post(`${baseUrl}/comments`, {bookId, comment, username, rating});

export const getCommentById = (bookId) => request.get(`${baseUrl}/comments?where=bookId%3D%22${bookId}%22`);

export const getMyCommentsByBookId = (bookId, userId) => request.get(`${baseUrl}/comments?where=bookId%3D%22${bookId}%22%20and%20_ownerId%3D%22${userId}%22&count`);

export const removeCommment = (commentId) => request.remove(`${baseUrl}/comments/${commentId}`);

export const getAllComments = (userId) => request.get(`${baseUrl}/comments?where=_ownerId%3D%22${userId}%22`);