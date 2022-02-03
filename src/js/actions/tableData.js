
export const storeLinkData = (data) => dispatch => {
    dispatch({
        type: 'ADD_LINK',
        data
    })
}

export const removeLinkData = (sheetName) => dispatch => {
    dispatch({
        type: 'REMOVE_LINK',
        sheetName
    })
}

export const getLinkData = (spreadSheetId) => dispatch => {
    dispatch({
        type: 'GET_LINK',
        spreadSheetId
    })
}