import axios from "axios";

export const authApiPublic = axios.create({
    baseURL: "/api/auth",
    withCredentials: false,
});

export const authApiSecure = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
});

export const userApi = axios.create({
    baseURL: "/api/user",
});