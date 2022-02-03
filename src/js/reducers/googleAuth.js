const INITIAL_STATE = {
    auth: false
}

export default function googleAuthReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'GAUTH_ON_SUCCESS':
            // console.log('reducer', action.auth)
            return {...state,  auth: true }
        default: {
            return state
        }
    }
}