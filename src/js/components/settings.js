import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Label, Grid } from 'theme-ui';
import { useDispatch } from 'react-redux';
import { storeAuthObject } from '../actions/googleAuth';

export default function Settings() {

	const dispatch = useDispatch();


	const [credentials, setCredentials] = useState(false);
	const [token, setToken] = useState(false)

	useEffect(async () => {
		const crd = await electron.checkCredentials();
		setCredentials(crd);
		const { state, authClient } = await electron.checkToken();
		setToken(state)
		if (state) {
			dispatch(storeAuthObject());
		}
	}, [electron.checkCredentials, token])

	const handleGoogleCredButton = async (event) => {
		event.preventDefault();
		electron.fileApi.saveOAuthCredentials();
		const crd = await electron.checkCredentials()
		setCredentials(crd);
	}

	const handleGoogleTokenAuth = async (event) => {
		event.preventDefault();
		await electron.fileApi.authenticate();
		setTimeout(async () => {
			const { state, authClient } = await electron.checkToken();
			setToken(state);
			if (state) {
				dispatch(storeAuthObject());
			}
		}, 5000)


	}

	return (
		<Container>
			<h1>Settings View</h1>
			<Card>
				<Grid
					columns={2}
					sx={{

					}}
				>
					<div>
						<Label>{credentials ? 'Credentials are set' : 'Set Credentials'}</Label>
						<Button
							onClick={handleGoogleCredButton}
							disabled={credentials}
						>
							Load Google Credentials
						</Button>
					</div>
					<div>
						<Label>{token ? 'Google Account Authenticated' : 'Authenticate Google Account'}</Label>
						<Button
							onClick={handleGoogleTokenAuth}
							disabled={!credentials || token}
						>
							Log In
						</Button>
					</div>
				</Grid>
			</Card>

		</Container>
	)
}