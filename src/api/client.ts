import axios from 'axios';

const client = axios.create({
  // baseURL: import.meta.env.PUBLIC_API_URL,
  baseURL: 'https://segment-genie-api.onrender.com',
});

export default client;
