import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export interface RequestOption {
  qs?: any;
  headers?: any;
  body?: any;
  timeout?: number;
}

interface HttpClientParams {
  baseUrl: string;
  headers?: any;
  proxy?: string;
  mapData?: (_: any) => any;
  mapError?: (_: any) => never;
}

export class ApiClient {

  constructor({
    baseUrl,
    headers,
    proxy,
    mapData,
    mapError,
  }: HttpClientParams) {
    this.http = axios.create({
      baseURL: baseUrl,
      headers: { ...headers, },
    });
    this.mapError = mapError ?? ((_: AxiosError) => {
      console.error(_);
      return Promise.reject(_.response?.data);
    });
    this.mapData = mapData ?? ((_: AxiosResponse) => _.data);
  }

  private readonly http: AxiosInstance;
  private readonly mapError: (_: any) => any;
  private readonly mapData: (_: any) => any;

  readonly get = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.http.get(uri, options)
      .then(this.mapData)
      .catch(this.mapError);
  };

  readonly post = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.http.post(uri, options?.body, options)
      .then(this.mapData)
      .catch(this.mapError);
  };

  readonly delete = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.http.delete(uri, options)
      .then(this.mapData)
      .catch(this.mapError);
  };

  readonly put = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.http.put(uri, options?.body, options)
      .then(this.mapData)
      .catch(this.mapError);
  };
}
