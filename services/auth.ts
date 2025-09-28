import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const API_BASE_URL = 'https://rocketseat-mba-marketplace.herokuapp.com';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await authApi.post('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await authApi.post('/auth/register', data);
  return response.data;
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const setToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync('token', token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const logout = async (): Promise<void> => {
  await removeToken();
};
