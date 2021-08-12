import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
};

class Http {
  private instance: AxiosInstance | null = null;

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp();
  }

  initHttp() {
    const http = axios.create({
      baseURL: 'http://localhost:8001/api',
      headers,
      withCredentials: true,
    });

    http.interceptors.response.use(
      (response) => response,
      ({ response }) => {
        return Promise.reject(response.data);
      },
    );

    this.instance = http;
    return http;
  }

  request<T, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this.http.request(config);
  }

  get<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.get<T, R>(url, config);
  }

  post<T, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.post<T, R>(url, data, config);
  }

  put<T, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.put<T, R>(url, data, config);
  }

  patch<T, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.patch<T, R>(url, data, config);
  }

  delete<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.delete<T, R>(url, config);
  }
}

export default new Http();
