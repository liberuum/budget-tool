const INITIAL_STATE = {
    id: '',
    cuId: '',
    userName: '',
    authToken: '',
    auth: false
}

export default function userReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'USER_LOGIN_ON_SUCCESS':
            console.log('USER_LOGIN_ON_SUCCESS reducer', action)
            return {
                ...state,
                id: action.userData.id,
                cuId: action.userData.cuId,
                userName: action.userData.userName,
                authToken: action.userData.authToken,
                auth: true
            }
        case 'USER_RESET':
            return {
                ...state,
                id: '',
                cuId: '',
                userName: '',
                authToken: '',
                auth: false
            }
        case 'USER_CHANGE_PASSWORD':
            return { ...state, authToken: '' }
        default: {
            return state
        }
    }
}