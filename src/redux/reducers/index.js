import {
    SET_STATUS,
    SET_STATUS_REF,
    SET_LANG,
    SET_CURRENT_ORDER,
} from "../actionTypes";

function rootReducer(state = {}, action) {
    switch (action.type) {
        case SET_STATUS:
            return {
                ...state,
                status: action.payload
            }

        case SET_STATUS_REF:
            return {
                ...state,
                status_ref: action.payload
            }

        case SET_LANG:
            return {
                ...state,
                lang: action.payload
            }

        case SET_CURRENT_ORDER:
            return {
                ...state,
                current_order: action.payload
            }

        default:
            return state;
    }
}

export default rootReducer;