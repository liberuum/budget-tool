const INITIAL_STATE = {
    links: []
}

export default function googleAuthReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'ADD_LINK':
            return {...state, links: [...state.links, action.data]}
        case 'REMOVE_LINK':
            return {
                ...state, 
                links: state.links.filter(item => item.sheetName !== action.sheetName )
            }
        case 'GET_LINK':
            return { 
                links: state.links.filter(item => item.spreadSheetId == action.spreadSheetId)
            }
        default: {
            return state
        }
    }
}