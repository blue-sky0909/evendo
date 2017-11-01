export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

const initialState = {
    data: [],
    error: null
};

export default function login(state = initialState, action) {
    switch (action.type) {
        case 'LOGIN_SUCCESS' :
            return {
                ...state,
                data : action.data
            };
        case 'LOGIN_FAILURE' :
            return {
                ...state,
                error: action.error
            };
        default:
            return state;
    }
};