import React from 'react';
import { useSelector } from 'react-redux';
import LoginToApi from './loginToApi';
import UserInfo from './userInfo';

export default function User() {

    const userFromStore = useSelector(store => store.user.auth)
    console.log('userFromStore', userFromStore)

    return (
        <>
            {userFromStore ? <UserInfo /> : <LoginToApi />}
        </>
    )
}