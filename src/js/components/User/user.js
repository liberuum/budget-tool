import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoginToApi from './loginToApi';
import UserInfo from './userInfo';
import { storeUserInfo } from '../../actions/user';

export default function User() {
    const dispatch = useDispatch();
    const userFromStore = useSelector(store => store.user.auth)
    console.log('userFromStore', userFromStore)

    useEffect(async () => {
        const userInfo = await electron.getApiCredentials();
        if(userInfo != null) {
            dispatch(storeUserInfo(userInfo))
        }
    }, [])




    return (
        <>
            {userFromStore ? <UserInfo /> : <LoginToApi />}
        </>
    )
}