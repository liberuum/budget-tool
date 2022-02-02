import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import googleAuthReducer from '../reducers/googleAuth';
import tableDataReducer from '../reducers/tableDataReducer';

export default function configureStore() {

    const middleWares = [
        thunkMiddleware
    ];

    const store = createStore(
        combineReducers({
            googleAuth: googleAuthReducer,
            tableData: tableDataReducer
        }), applyMiddleware(...middleWares)
    )

    return store;

}