import * as request from './requester';

const baseUrl = 'http://localhost:3030/data';

export const getAllProfiles = () => request.get(`${baseUrl}/profiles`);

export const getMyPofile = (userId) => request.get(`${baseUrl}/profiles?where=_ownerId%3D%22${userId}%22`);

export const setMyProfile = (profileInfo) => request.post(`${baseUrl}/profiles`, profileInfo);

export const editMyProfile = (userId, profileInfo) => request.put(`${baseUrl}/profiles/${userId}`, profileInfo);


