import { HttpRequestHub } from '../HttpRequestHub';

export const loginUser = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/auth/sign_in`,
        data: {
            meta: {},
            payload: [{ ...obj }]
        }
    }
    return HttpRequestHub(config);
}