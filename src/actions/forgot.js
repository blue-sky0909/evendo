import config from '../config/config'
import { checkHttpStatus, parseJSON} from '../http'
import { AsyncStorage } from 'react-native'

const REST_PASSWORD_SUCCESS = 'REST_PASSWORD_SUCCESS'
const REST_PASSWORD_FAILURE = 'REST_PASSWORD_FAILURE'

export function forgotPasswordSuccess(res) {
    return {
        type: REST_PASSWORD_SUCCESS
    }
}

export function forgotPasswordFailure(error) {
    return {
        type: REST_PASSWORD_FAILURE,
        error: error
    }
}

export function forgotPassword(email) {       
    return function(dispatch) {
        return fetch(config.endpoints.url + '/en' +config.endpoints.forgot +'?email=' + email, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(checkHttpStatus)
        .then(parseJSON)
        .then(res => {
            dispatch(forgotPasswordSuccess())
            return true
        }).catch(error => {
            dispatch(forgotPasswordFailure(error))
            return false
        })
    }
}