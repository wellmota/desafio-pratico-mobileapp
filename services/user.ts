import axios from 'axios';
import { getToken } from './auth';
import { User } from './auth';

const API_BASE_URL = 'https://rocketseat-mba-marketplace.herokuapp.com';

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const userApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
userApi.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUser = async (): Promise<User> => {
  const response = await userApi.get('/user/profile');
  return response.data;
};

export const updateUser = async (data: UpdateUserData): Promise<User> => {
  const response = await userApi.put('/user/profile', data);
  return response.data;
};

export const updatePassword = async (data: UpdatePasswordData): Promise<void> => {
  await userApi.put('/user/password', data);
};
