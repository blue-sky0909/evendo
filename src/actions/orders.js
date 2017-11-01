import config from '../config/config'
import { checkHttpStatus, parseJSON} from '../http'
import { AsyncStorage } from 'react-native'

const GET_ORDER_SUCCESS = 'GET_ORDER_SUCCESS'
const GET_ORDER_FAILURE = 'GET_ORDER_FAILURE'
const GET_ORDER_DETAIL_SUCCESS = 'GET_ORDER_DETAIL_SUCCESS'
const GET_ORDER_DETAIL_FAILURE = 'GET_ORDER_DETAIL_FAILURE'
const GET_ORDER_DETAIL_REQUEST = 'GET_ORDER_DETAIL_REQUEST'

export function getOrdersSuccess(res) {
    return {
        type: GET_ORDER_SUCCESS,
        orders: res
    }
}

export function getOrdersFailure(error) {
    return {
        type: GET_ORDER_FAILURE,
        error: error
    }
}

export function getOrderDetailRequest() {
    return {
        type: GET_ORDER_DETAIL_REQUEST
    }
}

export function getOrderDetailSuccess(res) {
    return {
        type: GET_ORDER_DETAIL_SUCCESS,
        orderDetail: res
    }
}

export function getOrderDetailFailure(error) {
    return {
        type: GET_ORDER_DETAIL_FAILURE,
        error: error
    }
}

export function getOrders() {
    
    return function(dispatch) {
        AsyncStorage.getItem('token').then((token)=>{
            return fetch(config.endpoints.orderUrl + '/da' + config.endpoints.orders, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'XXX-Evendo-Auth': token
                }
            }).then(checkHttpStatus)
            .then(parseJSON)
            .then(res => {
                AsyncStorage.setItem("orderInfo", JSON.stringify(res))
                dispatch(getOrdersSuccess(res))              
            }).catch(error => {
                dispatch(getOrdersFailure(error))
            })
        })        
    }    
}

export function getOrderDetails(orderId) {

    return function(dispatch) {
        dispatch(getOrderDetailRequest())
        AsyncStorage.getItem('token').then((token)=>{
            return fetch(config.endpoints.partyPlanUrl + '/da' + config.endpoints.detailOrder + orderId, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'XXX-Evendo-Auth': token
                }
            }).then(checkHttpStatus)
            .then(parseJSON)
            .then(res => {
                AsyncStorage.setItem("selectOrderDetail", JSON.stringify(res))
                dispatch(getOrderDetailSuccess(res))                
            }).catch(error => {
                dispatch(getOrderDetailFailure(error))
            })
        })         
    }    
}

export function getDistance(orderId) {
    return function(dispatch) {
        return new Promise(function(resolve, reject) {
            AsyncStorage.getItem('token').then((token)=>{
                fetch(config.endpoints.orderUrl + '/da' + config.endpoints.orders + "/" + orderId + "?detailed=true", {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'XXX-Evendo-Auth': token
                    }
                }).then(checkHttpStatus)
                .then(parseJSON)
                .then(res => {                    
                    resolve(res)
                }).catch(error => {
                    console.log("error===========>", error)
                    dispatch(getOrderDetailFailure(error))
                })
            })       
        })            
    }    
}

export function setValidateVoucher(voucherCodeEnding) {
    return function(dispatch) {
        return new Promise(function(resolve, reject) {
            AsyncStorage.getItem('token').then((token)=>{
                fetch(config.endpoints.orderUrl + '/da' + config.endpoints.orderVoucher + voucherCodeEnding, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'XXX-Evendo-Auth': token
                    }
                })
                .then(res => {
                    dispatch(getOrders())
                    resolve(res)
                }).catch(error => {
                    dispatch(getOrderDetailFailure(error))
                })
            })       
        })
            
    }    
}
/*
export function getOrderDetails(orderId) {

    return function(dispatch) {
        dispatch(getOrderDetailRequest())
        return new Promise(function(resolve, reject) {
            AsyncStorage.getItem('token').then((token)=>{
                fetch(config.endpoints.partyPlanUrl + '/da' + config.endpoints.detailOrder + orderId, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'XXX-Evendo-Auth': token
                    }
                }).then(checkHttpStatus)
                .then(parseJSON)
                .then(res => {
                    AsyncStorage.setItem("selectOrderDetail", JSON.stringify(res))
                    dispatch(getOrderDetailSuccess(res))
                    resolve(res)
                }).catch(error => {
                    dispatch(getOrderDetailFailure(error))
                })
            })       
        })
            
    }    
}
*/