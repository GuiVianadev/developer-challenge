import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const UNAUTHORIZED = 401;

export const api = axios.create({
  baseURL: 'http://localhost:8000',
});

let isRefreshing = false;
let failedRequestsQueue: {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}[] = [];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === UNAUTHORIZED) {
      const originalRequest = error.config as InternalAxiosRequestConfig;

      if (!isRefreshing) {
        isRefreshing = true;

        api
          .post('/auth/refresh_token')
          .then((response) => {
            const newToken = response.data.access_token;

            localStorage.setItem('authToken', newToken);
            // ✅ Alterado: Acesso via notação de ponto
            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

            // ✅ Alterado: de forEach para for...of
            for (const request of failedRequestsQueue) {
              request.onSuccess(newToken);
            }
            failedRequestsQueue = [];
          })
          .catch((err) => {
            for (const request of failedRequestsQueue) {
              request.onFailure(err);
            }
            failedRequestsQueue = [];
            localStorage.removeItem('authToken');
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            }
          },
          onFailure: (err: AxiosError) => {
            reject(err);
          },
        });
      });
    }

    return Promise.reject(error);
  }
);
