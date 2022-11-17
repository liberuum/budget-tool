import React, { useState, useEffect } from 'react';
import { Card, Label, Input, Button, Spinner } from "theme-ui";
import { useDispatch, useSelector } from 'react-redux';
import { storeUserInfo } from '../../actions/user';
import { useQuery, gql, useMutation } from "@apollo/client";
import { useSnackbar } from 'notistack';


export default function LoginToApi() {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

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
                    username,
                    roles {
                    id
                    name
                    permissions
                    }
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
        try {
            const result = await userLogin()
            let cuId = undefined;
            if (result.data.userLogin.user.roles != null) {
                const roles = result.data.userLogin.user.roles.map(role => {
                    return role.permissions;
                }).flat();
                roles.forEach(role => {
                    const id = role.substring(role.length - 2);
                    const regex = /[0-9]{2}/;
                    if (regex.test(id)) {
                        cuId = id;
                    }
                })
            } else {
                enqueueSnackbar('Cannot use tool without having assinged a CU id to your account', { variant: 'error' })
            }
            if (cuId !== undefined) {
                dispatch(storeUserInfo({
                    id: result.data.userLogin.user.id,
                    cuId,
                    username: result.data.userLogin.user.username,
                    authToken: result.data.userLogin.authToken
                }));
                electron.saveApiCredentials({
                    id: result.data.userLogin.user.id,
                    cuId,
                    username: result.data.userLogin.user.username,
                    authToken: result.data.userLogin.authToken
                })
                setusername('')
                setPassword('')
            } else {
                enqueueSnackbar('Cannot use tool without having assinged a CU id to your account', { variant: 'error' })
            }

        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
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
        </Card>
    )
}