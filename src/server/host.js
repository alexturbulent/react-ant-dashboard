import axios from "axios";

import { getCookie } from "../utils/useCookies";
import { userAccessTokenName } from "../constants";

export let host = "https://google.com";
export let port = "9000";

export let token = getCookie(userAccessTokenName);

export let headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": `Bearer ${token}`,
}

export let axiosInstance = axios.create({
    baseURL: `${host}:${port}`,
    headers,
    timeout: 30000,
})

export const setRequestHeader = (userToken) => {
    token = getCookie(userAccessTokenName);

    headers = {
        ...headers,
        "X-Authorization": `Bearer ${userToken}`,
    }

    axiosInstance = axios.create({
        baseURL: `${host}:${port}`,
        headers,
        timeout: 30000,
    })
}