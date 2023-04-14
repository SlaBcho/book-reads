import * as request from './requester';

const baseUrl = 'http://localhost:3030/data';

export const getMyPofile = (userId) => request.get(`${baseUrl}/profiles?where=userId%3D%22${userId}%22`);

export const setMyProfile = (userId, profileInfo) => request.post(`${baseUrl}/comments`, {userId, profileInfo});

export const edit = (userId, profileInfo) => request.put(`${baseUrl}/books/${userId}`, profileInfo);


