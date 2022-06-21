import React, { useEffect } from 'react';
import { Container } from "theme-ui"
import Table from './table';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { storeAuthObject } from '../actions/googleAuth';
import { storeUserInfo } from '../actions/user';
import NotAuthenticated from './notAuthenticated';

export default function BudgetSheet() {

    const dispatch = useDispatch();

    useEffect(async () => {
        const { state, authClient } = await electron.checkToken();
        const userInfo = await electron.getApiCredentials();
        if (state) {
            dispatch(storeAuthObject());
        }
        if(userInfo != null) {
            dispatch(storeUserInfo(userInfo))
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