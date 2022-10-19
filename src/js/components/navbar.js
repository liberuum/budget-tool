import React, { useEffect, useState } from 'react';
import { Container, Flex, Heading, Button, Divider } from "theme-ui"
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
    const [isDev, setIsDev] = useState(false);

    useEffect(async () => {
        const dev = await electron.getIsDev();
        setIsDev(dev)
    })

    const navigate = useNavigate();
    return (
        <Container>
            {isDev ? <Heading>MakerDAO Budget Tool <span style={{color: 'red'}}>Test</span> </Heading> : <Heading>MakerDAO Budget Tool</Heading>}
            <Divider></Divider>
            <Flex variant="flex.header">
                <Flex as="nav">
                    <Button onClick={() => navigate('/')} sx={{ mx: 1 }}>Budget Sheets</Button>
                    <Button onClick={() => navigate('/settings')}>Settings</Button>
                </Flex>
            </Flex>
        </Container>
    )
}