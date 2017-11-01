import config from '../config/config'
import { checkHttpStatus, parseJSON} from '../http'
import { AsyncStorage } from 'react-native'

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGIN_FAILURE = 'LOGIN_FAILURE'

export function loginActionSuccess(res) {
    return {
        type: LOGIN_SUCCESS,
        data: res
    }
}

export function loginActionFailure(error) {
    return {
        type: LOGIN_FAILURE,
        error: error
    }
}

export function loginAction(email, password) {   
    return function(dispatch) {
        return fetch(config.endpoints.url + '/da' +config.endpoints.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(checkHttpStatus)
        .then(parseJSON)
        .then(res => {
            AsyncStorage.setItem("token", res.authToken)
            dispatch(loginActionSuccess(res))
            return true
        }).catch(error => {
            dispatch(loginActionFailure(error))
        })
    }
}

export function fbCreate(token) {
    return function(dispatch) {
        return fetch(config.endpoints.url + '/en' +config.endpoints.fbCreate +'?token=' + token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(checkHttpStatus)
        .then(parseJSON)
        .then(res => {
            dispatch(fbLogin(token))
        }).catch(error => {
            if(error.response.status == '412') {
                dispatch(fbLogin(token))
            } else {
                dispatch(loginActionFailure(error))
            }
        })
    }
}

export function fbLogin(token) {
    return function(dispatch) {
        return fetch(config.endpoints.url + '/en' +config.endpoints.fbLogin +'?token=' + token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(checkHttpStatus)
        .then(parseJSON)
        .then(res => {
            AsyncStorage.setItem("token", res.authToken)
            dispatch(loginActionSuccess(res))
            return true
        }).catch(error => {
            console.log("errror====>", error)
            dispatch(loginActionFailure(error))
        })
    }
}

export function googleCreate(token) {
    return function(dispatch) {
        return fetch(config.endpoints.url + '/en' +config.endpoints.googleCreate +'?token=' + token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(checkHttpStatus)
        .then(parseJSON)
        .then(res => {
            dispatch(googleLogin(token))
            return true
        }).catch(error => {
            dispatch(loginActionFailure(error))
        })
    }
}

export function googleLogin(token) {
    return function(dispatch) {
        return fetch(config.endpoints.url + '/en' +config.endpoints.googleLogin +'?token=' + token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(checkHttpStatus)
        .then(parseJSON)
        .then(res => {
            AsyncStorage.setItem("token", res.authToken)
            dispatch(loginActionSuccess(res))
            return true
        }).catch(error => {
            if(error.response.status == '412') {
                dispatch(loginActionFailure(error))
                //dispatch(googleCreate(token))
                return false
            } else {
                dispatch(loginActionFailure(error))
            }
        })
    }
}