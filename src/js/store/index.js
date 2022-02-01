import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import googleAuthReducer from '../reducers/googleAuth';

export default function configureStore() {

    const middleWares = [
        thunkMiddleware
    ];

    const store = createStore(
        combineReducers({
            googleAuth: googleAuthReducer
        }), applyMiddleware(...middleWares)
    )

    return store;

}