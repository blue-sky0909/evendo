const GET_ORDER_SUCCESS = 'GET_ORDER_SUCCESS'
const GET_ORDER_FAILURE = 'GET_ORDER_FAILURE'
const GET_ORDER_DETAIL_SUCCESS = 'GET_ORDER_DETAIL_SUCCESS'
const GET_ORDER_DETAIL_FAILURE = 'GET_ORDER_DETAIL_FAILURE'
const GET_ORDER_DETAIL_REQUEST = 'GET_ORDER_DETAIL_REQUEST'

const initialState = {
    data: [],
    orderDetail: {},
    error: null,
    loading: true,
    loaded: false
};

export default function order(state = initialState, action) {
    switch (action.type) {
        case 'GET_ORDER_SUCCESS' :
            return {
                ...state,
                data : action.orders,
                loading: false,
                loaded: true
            };
        case 'GET_ORDER_FAILURE' :
            return {
                ...state,
                error: action.error,
                loading: true,
                loaded: false
            };
        case 'GET_ORDER_DETAIL_REQUEST' :
            return {
                ...state,
                orderDetail: {},
                loading: true,
                loaded: false
            };
        case 'GET_ORDER_DETAIL_SUCCESS' :
            return {
                ...state,
                orderDetail : action.orderDetail,
                loading: false,
                loaded: true
            };
        case 'GET_ORDER_DETAIL_FAILURE' :
            return {
                ...state,
                error: action.error,
                loading: true,
                loaded: false
            };
        default:
            return state;
    }
};