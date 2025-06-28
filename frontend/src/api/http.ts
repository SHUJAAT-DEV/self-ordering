/* eslint-disable no-param-reassign */
import axios, { AxiosInstance } from "axios";

export const BASE_URL =  "http://192.168.50.113:3000/api/v1";

type AxiosAdapterProperties = {
  isAuth?: boolean;
};

const http = ({ isAuth = false }: AxiosAdapterProperties) => {
  const getAxiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL, // for deployment/production
    timeout: 30_000,
    headers: {
      Accept: "application/json",
      "Content-Type": isAuth
        ? "application/x-www-form-urlencoded"
        : "application/json;charset=UTF-8",
    },
  });
  getAxiosInstance.interceptors.request.use(
    (config: any) => {
      return config;
    },
    (error: any) => Promise.reject(error)
  );

  return getAxiosInstance;
};

export default http;
