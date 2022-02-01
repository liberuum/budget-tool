const INITIAL_STATE = {
    auth: null
}

export default function googleAuthReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'GAUTH_ON_SUCCESS':
            return { auth: action.auth }
        default: {
            return state
        }
    }
}