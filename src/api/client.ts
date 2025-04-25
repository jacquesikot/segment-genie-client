import axios, { InternalAxiosRequestConfig } from 'axios';
import { keys, storage } from '../lib/storage';

// Define the interface for user data
interface UserData {
  email: string | undefined;
  fullName: string | null;
  imageUrl: string;
  id: string;
  token: string;
}

const client = axios.create({
  // baseURL: import.meta.env.PUBLIC_API_URL,
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor to attach the auth token to all requests
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Get the user data from storage
  const userData = storage.getItem(keys.USER) as UserData | null;

  // If we have a token, add it to the request headers
  if (userData?.token) {
    config.headers.Authorization = `Bearer ${userData.token}`;
  }

  return config;
});

export default client;
