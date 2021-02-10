import { HttpRequestHub } from '../HttpRequestHub';

export const getOrders = (type, range) => {
    const config = {
        method: 'POST',
        url: `/order/all_${type}`,
        data: {
            meta: {},
            payload: [{ ...range }],
        }
    }
    return HttpRequestHub(config);
}

export const createOrder = (obj) => {
    const config = {
        method: 'POST',
        url: `/order/create`,
        data: {
            meta: {},
            payload: [{ ...obj }],
        }
    }
    return HttpRequestHub(config);
}

export const updateOrder = (obj) => {
    const config = {
        method: 'POST',
        url: `/order/update`,
        data: {
            meta: {},
            payload: [{ ...obj }],
        }
    }
    return HttpRequestHub(config);
}

export const getOrderReport = (obj) => {
    const config = {
        method: 'POST',
        url: `/excel/orders/import_default`,
        responseType: "blob",
        data: {
            meta: {},
            payload: [{ ...obj }],
        }
    }
    return HttpRequestHub(config);
}