import React from 'react';
import { Container, Flex, Heading, Button, Divider } from "theme-ui"
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
    const navigate = useNavigate();
    return (
        <Container>
            <Heading>MakerDAO Budget Tool</Heading>
            <Divider></Divider>
            <Flex variant="flex.header">
                <Flex as="nav">
                    <Button onClick={() => navigate('/')} sx={{mx: 1}}>Budget Sheets</Button>
                    <Button onClick={() => navigate('/settings')}>Settings</Button>
                </Flex>
            </Flex>
        </Container>
    )
}