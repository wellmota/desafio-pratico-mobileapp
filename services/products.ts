import axios from 'axios';
import { getToken } from './auth';

const API_BASE_URL = 'https://rocketseat-mba-marketplace.herokuapp.com';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  views: number;
  seller: {
    id: string;
    name: string;
    phone: string;
  };
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const productsApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
productsApi.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  const params = new URLSearchParams();
  
  if (filters?.search) {
    params.append('search', filters.search);
  }
  if (filters?.category) {
    params.append('category', filters.category);
  }
  if (filters?.minPrice) {
    params.append('minPrice', filters.minPrice.toString());
  }
  if (filters?.maxPrice) {
    params.append('maxPrice', filters.maxPrice.toString());
  }

  const response = await productsApi.get(`/products?${params.toString()}`);
  return response.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await productsApi.get(`/products/${id}`);
  return response.data;
};

export const getCategories = async (): Promise<string[]> => {
  const response = await productsApi.get('/products/categories');
  return response.data;
};
