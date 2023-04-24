import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { BASE_URL, BASE_URL_Local } from "./Api/BASE_URL";

// const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_AUTH;

const onRequest = (config) => {
  const token = JSON.parse(localStorage.getItem("user"));
  if (token) {
    console.log(token);
    config.headers["Authorization"] = `Bearer ${token.access.token}`;
  }

  return config;
};

const onRequestError = (error) => {
  return Promise.reject(error);
};

const onResponse = (response) => {
  console.log(response);
  return response;
};

const onResponseError = async (error) => {
  if (error.response) {
    // Access Token was expired
    // if (
    //   error.response.data.code === 401 &&
    //   error.response.data.message === "Please authenticate"
    // ) {
    //   let storedToken = JSON.parse(localStorage.getItem("refresh_token"));
    //   // storedToken = storedToken === null && ""
    //   console.log(storedToken);
    //   try {
    //     const { data } = await axios.post(`${BASE_URL}/auth/refresh-tokens`, {
    //       refreshToken: storedToken,
    //     });
    //     console.log(data);

    //     const { access } = data;
    //     const { token } = access;
    //     // console.log(access.token);
    //     localStorage.setItem("access_token", JSON.stringify(token));
    //     // localStorage.setItem("userData", JSON.stringify(user));
    //     const prevRequest = error?.config;
    //     return axios({
    //       ...prevRequest,
    //       headers: { ...prevRequest.headers, Authorization: `Bearer ${token}` },
    //       sent: true,
    //     });
    //   } catch (_error) {
    //     return Promise.reject(_error);
    //   }
    // }
    alert("Please signin again");
  }
  return Promise.reject(error);
};

export const setupInterceptorsTo = (axiosInstance) => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};
