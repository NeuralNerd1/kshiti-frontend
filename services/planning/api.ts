import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,

  // ✅ ensures request body is always treated as JSON
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ======================================================
   REQUEST INTERCEPTOR
====================================================== */

api.interceptors.request.use(
  (config) => {
    // ✅ attach token
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ ensure data is never undefined
    if (config.data === undefined) {
      config.data = {};
    }

    // ✅ DEV DEBUG (very important)
    if (process.env.NODE_ENV === "development") {
      console.group(
        `%cAPI REQUEST → ${config.method?.toUpperCase()} ${config.url}`,
        "color:#7c7cff;font-weight:bold"
      );
      console.log("Headers:", config.headers);
      console.log("Payload:", config.data);
      console.groupEnd();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ======================================================
   RESPONSE DEBUG
====================================================== */

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.group(
        `%cAPI RESPONSE ← ${response.config.url}`,
        "color:#4ade80;font-weight:bold"
      );
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.groupEnd();
    }

    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === "development") {
      console.group(
        `%cAPI ERROR ← ${error.config?.url}`,
        "color:#ef4444;font-weight:bold"
      );
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
      console.groupEnd();
    }

    return Promise.reject(error);
  }
);

export default api;
