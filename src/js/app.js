import React, { useEffect, useState } from 'react';
import Settings from './components/settings'
import Navbar from './components/navbar';
import BudgetSheet from './components/budgetSheet';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import JSONView from './components/exportJSONview';
import MDView from './components/exportMDview';
import ApiView from './components/exportApiView';
import {
    ApolloClient, InMemoryCache, ApolloProvider
} from "@apollo/client";
import Modal from './components/modal/modal';

export default function App() {
    const [isDev, setIsDev] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [appVersion, setAppVersion] = useState('')
    const latestVersion = '1.2.0';

    useEffect(async () => {
        const dev = await electron.getIsDev();
        const version = await electron.getAppVersion();
        setAppVersion(version)
        setIsDev(dev)
        needingUpdate()
        const interval = setInterval(() => {
            needingUpdate()
        }, 120000)
        return () => clearInterval(interval);
    }, []);

    const client = new ApolloClient({
        uri: isDev ? 'https://publish-dev-2cx6rcfwf0t9ckrbfy.herokuapp.com/graphql' : 'https://ecosystem-dashboard.herokuapp.com/graphql',
        cache: new InMemoryCache()
    });

    const needingUpdate = () => {
        if(isSameVersion(appVersion, latestVersion)) {
            setOpenModal(true)
        }
    }

    const isSameVersion = (appVersion, latestVersion) => {
        const result = appVersion.localeCompare(latestVersion, undefined, { numeric: true, sensitivity: 'base' })
        if (result === -1) return true;
        return false;
    }

    const handleCloseModal = (event) => {
        event.preventDefault();
        setOpenModal()
    }

    return (
        <>
            <ApolloProvider client={client}>
                {openModal && <Modal closeModal={handleCloseModal} currentVersion={appVersion} newVersion={latestVersion} />}
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<BudgetSheet />} />
                        <Route path='/settings' element={<Settings />} />
                        <Route path='/json/:spreadsheetId/:tabId' element={<JSONView />} />
                        <Route path='/md/:spreadsheetId/:tabId' element={<MDView />} />
                        <Route path='/api/:spreadsheetId/:tabId' element={<ApiView />} />
                    </Routes>
                </Router>
            </ApolloProvider>
        </>

    )
};