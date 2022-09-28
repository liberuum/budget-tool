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
import AppVersionAlert from './components/modal/appVersionAlert';
import CommentTable from './components/comment/commentTable';

export default function App() {
    const [isDev, setIsDev] = useState(false);

    useEffect(async () => {
        const dev = await electron.getIsDev();
        setIsDev(dev)
    }, []);

    const client = new ApolloClient({
        uri: isDev ? 'https://publish-dev-vpighsmr70zxa92r9w.herokuapp.com/graphql' : 'https://ecosystem-dashboard.herokuapp.com/graphql',
        cache: new InMemoryCache()
    });

    return (
        <>
            <ApolloProvider client={client}>
                <AppVersionAlert />
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<BudgetSheet />} />
                        <Route path='/settings' element={<Settings />} />
                        <Route path='/json/:spreadsheetId/:tabId' element={<JSONView />} />
                        <Route path='/md/:spreadsheetId/:tabId' element={<MDView />} />
                        <Route path='/api/:spreadsheetId/:tabId' element={<ApiView />} />
                        <Route path='/update/:walletId/:month' element={<CommentTable />} />
                    </Routes>
                </Router>
            </ApolloProvider>
        </>

    )
};