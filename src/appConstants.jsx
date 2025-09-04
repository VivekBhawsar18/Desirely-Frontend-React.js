// This file centralizes all API endpoints for easy management and updates.
export const API_BASE_URL = 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  creators: `${API_BASE_URL}/creators`,
  creator: `${API_BASE_URL}/creator`,
  image: {
    upload: `${API_BASE_URL}/image/upload/`,
    get: (imageId) => `${API_BASE_URL}/image/get/${imageId}`,
  },
  deleteCreator: (creatorId) => `${API_BASE_URL}/creator/delete/${creatorId}`,
  updateCreator: (creatorId) => `${API_BASE_URL}/creator/${creatorId}`,
};

export const API_STATUS = {
  loading: 'Loading...',
  success: 'Success',
  error: 'Error',
};
