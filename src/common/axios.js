import axios from "axios";
import {setLoggedIn} from "../admin/login/slices/login";
import store from "../store";
import {toast} from "../routes";

export const baseURL = "https://api2.webcoder.az/api";
// export const baseURL = "http://tenbel.test/api";
const defaultHeaders = {
    "Content-type": "application/json",
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
};

const instance = axios.create({
    baseURL: baseURL,
    rejectUnauthorized: false,
    headers: {
        ...defaultHeaders,
    },
});

instance.interceptors.request.use(
    async (config) => {
        const localData = JSON.parse(localStorage.getItem("user"));
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${localData.token}`,
        };
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        toast.current.show({
            severity: "error",
            summary: error.message,
            life: 3000,
        });
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            localStorage.removeItem("user");
            store.dispatch(setLoggedIn(false));
            return instance(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default instance;
