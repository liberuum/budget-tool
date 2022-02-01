
export const storeAuthObject = (auth) => dispatch => {
    dispatch({
        type: 'GAUTH_ON_SUCCESS',
        auth
    })
}