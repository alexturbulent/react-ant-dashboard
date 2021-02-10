import { HttpRequestHub } from '../HttpRequestHub';

export const getCarBrands = () => {
    const config = {
        method: 'GET',
        url: `/auto_model_brand/all`,
    }
    return HttpRequestHub(config);
}

export const getActiveCarBrands = () => {
    const config = {
        method: 'GET',
        url: `/auto_model_brand/all_active`,
    }
    return HttpRequestHub(config);
}

export const createCarBrand = (obj) => {
    const config = {
        method: 'POST',
        url: `/auto_model_brand/create`,
        data: {
            meta: {},
            payload: [{ ...obj }],
        }
    }
    return HttpRequestHub(config);
}

export const updateCarBrand = (obj) => {
    const config = {
        method: 'POST',
        url: `/auto_model_brand/update`,
        data: {
            meta: {},
            payload: [{ ...obj }],
        }
    }
    return HttpRequestHub(config);
}

export const deleteCarBrand = (obj) => {
    const config = {
        method: 'POST',
        url: `/auto_model_brand/delete`,
        data: {
            meta: {},
            payload: [...obj],
        }
    }
    return HttpRequestHub(config);
}