import {
    SET_STATUS,
    SET_STATUS_REF,
    SET_LANG,
    SET_CURRENT_ORDER,
} from '../actionTypes';

export const setStatusRef = (obj) => ({
    type: SET_STATUS_REF,
    payload: obj,
})

export const setStatus = (obj) => ({
    type: SET_STATUS,
    payload: obj,
})

export const setLang = (obj) => ({
    type: SET_LANG,
    payload: obj,
})

export const setCurrentOrder = (obj) => ({
    type: SET_CURRENT_ORDER,
    payload: obj,
})