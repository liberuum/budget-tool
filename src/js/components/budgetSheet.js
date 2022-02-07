import React, { useEffect } from 'react';
import { Container } from "theme-ui"
import Table from './table';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { storeAuthObject } from '../actions/googleAuth';
import NotAuthenticated from './notAuthenticated';

export default function BudgetSheet() {

    const dispatch = useDispatch();

    useEffect(async () => {
        const { state, authClient } = await electron.checkToken();
        if (state) {
            dispatch(storeAuthObject());
        }
    }, [])


    const gAuth = useSelector((googleAuth) => googleAuth.googleAuth.auth);

    return (
        <Container>
            {gAuth ? <Table /> : <NotAuthenticated />}
        </Container>
    )
}