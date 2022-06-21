import React, { useState, useEffect } from 'react';
import { Card, Label, Input, Button, Spinner } from "theme-ui";
import { useDispatch, useSelector } from 'react-redux';
import { storeUserInfo } from '../../actions/user';
import { useQuery, gql, useMutation } from "@apollo/client";
import AlertHoC from '../utils/AlertHoC.js'



export default function LoginToApi() {
    const dispatch = useDispatch();

    useEffect(() => {

    }, [])


    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleUserName = (value) => {
        setUserName(value)
    }

    const handlePassword = (value) => {
        setPassword(value)
    }



    const LOGIN_USER = gql`
        mutation userLogin($input: AuthInput!) {
            userLogin(input: $input) {
                user {
                    id
                    cuId
                    userName
                }
                authToken
            }
        }
        `;

    const [userLogin, { data, loading, error }] = useMutation(LOGIN_USER, {
        variables: {
            input: {
                userName,
                password
            }
        },
        fetchPolicy: 'no-cache'
    });

    if (error) {
        <AlertHoC props={error.message}/>
    }

    const handleLoginBtn = async () => {
        console.log('userName', userName)
        console.log('password', password)
        const result = await userLogin()
        console.log('result', result)
        dispatch(storeUserInfo({
            id: result.data.userLogin.user.id,
            cuId: result.data.userLogin.user.cuId,
            userName: result.data.userLogin.user.userName,
            authToken: result.data.userLogin.authToken
        }));
        electron.saveApiCredentials({
            id: result.data.userLogin.user.id,
            cuId: result.data.userLogin.user.cuId,
            userName: result.data.userLogin.user.userName,
            authToken: result.data.userLogin.authToken
        })
        setUserName('')
        setPassword('')
    }



    return (
        <Card sx={{ display: 'flex', mt: '20px', mb: '20px', mx: "33%", alignItems: 'center', justifyContent: 'center', }}>
            <div>
                <Label>Authenticate with Ecosystem Performance Api</Label>
                <div>
                    <Label>Username</Label>
                    <Input
                        value={userName}
                        onChange={e => handleUserName(e.target.value)}
                    ></Input>
                </div>
                <div>
                    <Label>Password</Label>
                    <Input
                        value={password}
                        onChange={e => handlePassword(e.target.value)}
                        type='password'
                    ></Input>
                </div>
                {loading ? <Spinner variant="styles.spinner" title="loading"></Spinner> : <Button
                    sx={{ mt: "10px" }}
                    onClick={handleLoginBtn}
                >Log In</Button>}

            </div>
            {error ? <AlertHoC props={error.message} /> : ''}
        </Card>
    )
}