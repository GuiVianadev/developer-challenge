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

const processSuccessQueue = (newToken: string) => {
  for (const request of failedRequestsQueue) {
    request.onSuccess(newToken);
  }
  failedRequestsQueue = [];
};

const processFailureQueue = (error: AxiosError) => {
  for (const request of failedRequestsQueue) {
    request.onFailure(error);
  }
  failedRequestsQueue = [];
};

const updateDefaultHeaders = (token: string) => {
  if (api.defaults.headers.common) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

const clearAuthentication = () => {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};

const performTokenRefresh = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('authToken');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await api.post(
    '/auth/refresh_token',
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  const newToken = response.data.access_token;
  localStorage.setItem('authToken', newToken);
  updateDefaultHeaders(newToken);

  return newToken;
};

const addRequestToQueue = (
  originalRequest: InternalAxiosRequestConfig
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    failedRequestsQueue.push({
      onSuccess: (token: string) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        } else {
          reject(new Error('No headers in original request'));
        }
      },
      onFailure: (err: AxiosError) => {
        reject(err);
      },
    });
  });
};

const handleTokenRefresh = async (): Promise<void> => {
  try {
    const newToken = await performTokenRefresh();
    processSuccessQueue(newToken);
  } catch (err) {
    processFailureQueue(err as AxiosError);
    clearAuthentication();
  } finally {
    isRefreshing = false;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === UNAUTHORIZED) {
      const originalRequest = error.config as InternalAxiosRequestConfig;

      if (!isRefreshing) {
        isRefreshing = true;
        handleTokenRefresh();
      }

      return addRequestToQueue(originalRequest);
    }

    return await Promise.reject(error);
  }
);
