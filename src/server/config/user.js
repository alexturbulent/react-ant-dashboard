import { HttpRequestHub } from '../HttpRequestHub';

export const getUsers = () => {
    const config = {
        method: 'GET',
        url: `/users/employees`,
    }
    return HttpRequestHub(config);
}

export const getMerchants = () => {
    const config = {
        method: 'GET',
        url: `/users/merchants`,
    }
    return HttpRequestHub(config);
}

export const getRoles = () => {
    const config = {
        method: 'GET',
        url: `/role/all`,
    }
    return HttpRequestHub(config);
}

export const createUser = (obj) => {
    const config = {
        method: 'POST',
        url: `/users/create`,
        data: {
            meta: {},
            payload: [{ ...obj }],
        }
    }
    return HttpRequestHub(config);
}

export const updateUser = (obj) => {
    const config = {
        method: 'POST',
        url: `/users/update`,
        data: {
            meta: {},
            payload: [{ ...obj }],
        }
    }
    return HttpRequestHub(config);
}

export const deleteUser = (obj) => {
    const config = {
        method: 'POST',
        url: `/users/delete`,
        data: {
            meta: {},
            payload: [...obj],
        }
    }
    return HttpRequestHub(config);
}

export const resetPassword = (obj) => {
    const config = {
        method: 'POST',
        url: `/users/set_password`,
        data: {
            meta: {},
            payload: [{...obj}],
        }
    }
    return HttpRequestHub(config);
}