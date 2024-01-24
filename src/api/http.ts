import axios from 'axios';
import type {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  RawAxiosResponseHeaders,
  AxiosResponseHeaders,
} from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
/* import { useUserStore } from '@/store'; */
import { getToken } from '@/utils/auth';

export interface HttpResponse<T = any, D = any> {
  status: number;
  msg: string;
  code: number;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: AxiosRequestConfig<D>;
  data: T;
}

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : '',
  timeout: 60000,
});
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  },
);
// add response interceptors
service.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>): any => {
    const res = response.data;
    console.log('🚀 ~ file: http.ts:50 ~ res:', res);
    console.log('🚀 ~ file: http.ts:50 ~ res:', res.code);
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message.error({
        content: res.msg || 'Error',
        duration: 5 * 1000,
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        [50008, 50012, 50014].includes(res.code) &&
        response.config.url !== '/api/user/info'
      ) {
        Modal.error({
          title: 'Confirm logout',
          content:
            'You have been logged out, you can cancel to stay on this page, or log in again',
          okText: 'Re-Login',
          async onOk() {
            // const userStore = useUserStore();
            //  await userStore.logout();
            window.location.reload();
          },
        });
      }
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error) => {
    Message.error({
      content: error.msg || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);
const http = {
  request: service,
  /**
   * methods: request
   * @param url request address
   * @param params request params
   */
  get(url: string, params?: any) {
    params = {
      _t: Date.parse(String(new Date())) / 1000,
      ...params,
    };
    const config = {
      method: 'get',
      url,
      params,
    };
    if (params) {
      config.params = params;
    }
    return service(config);
  },
  fetch(url: string, params?: any) {
    params = {
      _t: Date.parse(String(new Date())) / 1000,
      ...params,
    };
    const config = {
      method: 'get',
      url,
      paramsData: params,
    };
    return service(config);
  },
  post(url: string, params?: any) {
    const config: any = {
      method: 'post',
      url,
    };
    if (params) config.data = params;
    return service(config);
  },
};
// export
export default http;
