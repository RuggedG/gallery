import axios from "axios";

const axiosClient = axios.create({
  baseURL: `http://localhost:5000/api/v1`,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : null;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      console.log("No response Error: ", error);
      return Promise.reject({
        message: "Server Error, please try again later",
        success: false,
      });
    }
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    return Promise.reject(error.response.data);
  }
);

export { axiosClient };
