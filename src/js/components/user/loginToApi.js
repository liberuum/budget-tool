import React, { useState, useEffect } from 'react';
import { Card, Label, Input, Button, Spinner } from "theme-ui";
import { useDispatch, useSelector } from 'react-redux';
import { storeUserInfo } from '../../actions/user';
import { useQuery, gql, useMutation } from "@apollo/client";
import AlertHoC from '../utils/alertHoC';


export default function LoginToApi() {
    const dispatch = useDispatch();

    useEffect(() => {

    }, [])


    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');
    const [stateError, setStateError] = useState('')

    const handleusername = (value) => {
        setusername(value)
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
                    username
                }
                authToken
            }
        }
        `;

    const [userLogin, { data, loading, error }] = useMutation(LOGIN_USER, {
        variables: {
            input: {
                username,
                password
            }
        },
        fetchPolicy: 'no-cache'
    });

    const handleLoginBtn = async () => {
        const result = await userLogin()
        if (result.data.userLogin.user.cuId !== null) {
            dispatch(storeUserInfo({
                id: result.data.userLogin.user.id,
                cuId: result.data.userLogin.user.cuId,
                username: result.data.userLogin.user.username,
                authToken: result.data.userLogin.authToken
            }));
            electron.saveApiCredentials({
                id: result.data.userLogin.user.id,
                cuId: result.data.userLogin.user.cuId,
                username: result.data.userLogin.user.username,
                authToken: result.data.userLogin.authToken
            })
            setusername('')
            setPassword('')
        } else {
            setStateError('cannot use tool without cu id')
        }
    }



    return (
        <Card sx={{ display: 'flex', mt: '20px', mb: '20px', mx: "33%", alignItems: 'center', justifyContent: 'center', }}>
            <div>
                <Label>Authenticate with Ecosystem Performance Api</Label>
                <div>
                    <Label>Username</Label>
                    <Input
                        value={username}
                        onChange={e => handleusername(e.target.value)}
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
            {error || stateError ? <AlertHoC props={error ? error.message : stateError} /> : ''}
        </Card>
    )
}