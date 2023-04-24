import axios from "axios";
import { BASE_URL } from "./BASE_URL";
import { setupInterceptorsTo } from "../interceptor.js";

const API = setupInterceptorsTo(axios.create({ baseURL: BASE_URL }));
// const WAREHOUSE_API = setupInterceptorsTo(
//   axios.create({ baseURL: WAREHOUSE_URL })
// );

//auth api

export const registerUser = (data) => API.post("/auth/register", data);
export const userLogin = (data) => API.post("/auth/login", data);

//Warehouse apis
export const getProducts = () => API.get("/warehouse/products");

export const placeOrder = (data) => API.post("/order/place", data);
