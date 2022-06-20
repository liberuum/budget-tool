export const storeUserInfo = (userData) => dispatch => {
    dispatch({
        type: 'USER_LOGIN_ON_SUCCESS',
        userData
    })
}

export const resetUserInfo = () => dispatch => {
    dispatch({
        type: 'USER_RESET'
    })
}