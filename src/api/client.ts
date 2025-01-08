import axios from 'axios';

const client = axios.create({
  // baseURL: import.meta.env.PUBLIC_API_URL,
  baseURL: import.meta.env.VITE_API_URL,
});

export default client;
