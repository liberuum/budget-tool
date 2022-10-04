import React, { useEffect, useState } from 'react';
import { Container } from "theme-ui"
import Table from './table/table';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { storeAuthObject } from '../actions/googleAuth';
import { storeUserInfo, resetUserInfo } from '../actions/user';
import NotAuthenticated from './notAuthenticated';
import jwtDecode from 'jwt-decode';

export default function BudgetSheet() {

    const dispatch = useDispatch();

    useEffect(async () => {
        const { state } = await electron.checkToken();
        const userInfo = await electron.getApiCredentials();
        if (state) {
            dispatch(storeAuthObject());
        }
        if (userInfo != null) {
            const decodedExp = jwtDecode(userInfo.authToken)
            const currentTime = new Date().getTime() / 1000;
            if (decodedExp.exp > currentTime) {
                dispatch(storeUserInfo(userInfo))
            } else {
                dispatch(resetUserInfo())
                electron.resetApiCredentials()
            }
        }
    }, [])


    const gAuth = useSelector((googleAuth) => googleAuth.googleAuth.auth);
    const userFromStore = useSelector(store => store.user.auth);

    return (
        <Container>
            {gAuth && userFromStore ? <Table /> : <NotAuthenticated />}
        </Container>
    )
}