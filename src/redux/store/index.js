import { createStore, compose } from 'redux';
import reducers from '../reducers';
import { lang_content } from "../../lang";

const initialState = {
    lang: 'ru',
    langs: lang_content,
    status: [],
    status_ref: [],
    current_order: null,
}
const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && process.env.NODE_ENV !== 'production' ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    : compose;


export default createStore(
    reducers,
    initialState,
    composeEnhancers,
);