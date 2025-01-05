import { keys, storage } from '@/lib/storage';
import axios from 'axios';

const client = axios.create({
  // baseURL: import.meta.env.PUBLIC_API_URL,
  baseURL: 'https://segment-genie-api.onrender.com',
});

client.interceptors.request.use(async (config) => {
  // Get session token from local storage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = storage.getItem(keys.USER) as any;

  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default client;
