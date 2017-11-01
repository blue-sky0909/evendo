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
    