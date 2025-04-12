import { getCookie, handleLogoutRedirect } from "@/lib/utils";
import axios from "axios";

const client = axios.create({
  // baseURL: import.meta.env.PUBLIC_API_URL,
  baseURL: import.meta.env.VITE_API_URL,
});

client.interceptors.request.use(function (config) {
  let token = getCookie("_tk");
  if (token) {
    token = "Bearer " + token;
    config.headers.authorization = token;
  }

  return config;
});

client.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    if (error?.response?.status === 401) {
      handleLogoutRedirect();
    }

    throw error?.response?.data;
  }
);

export default client;
