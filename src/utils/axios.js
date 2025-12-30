import axios from "axios";
import { useStore } from "@/store";

axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": `${import.meta.env.VITE_API_BASE_URL}`,
  },
});

// Add a request interceptor
api.interceptors.request.use(function (config) {
  // @ts-ignore
  config.headers.Authorization = `Bearer ${useStore().token}`;
  return config;
});


api.interceptors.response.use(
  function (response) {
    // Check for successful response with a message
    if ((response.data.status && response.data.message) || (response.data.status === true && response.data.message)) {
      console.log("response.data.message");
    }

    else if (response.data.status === 401 || response.data.status === 404 || response.data.status === 500 || response.data.status === false) {

      return Promise.reject(response, "error");
    }
    // Continue with the response object for successful requests without special handling
    return response;
  },
  function (error) {
    // Handle errors
    let errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Unknown error occurred";
    if (error.status === 403) {
      errorMessage = "You don't have permission on this part.";
    }
    if (error.status === 401) {
      console.log("call")
      useStore().unAuthenticated();
    }

    return Promise.reject(error);
  }
);

