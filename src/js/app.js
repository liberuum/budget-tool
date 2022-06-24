import React from 'react';
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
import { useSelector } from 'react-redux';



export default function App() {
    const userFromStore = useSelector(store => store.user)

    const client = new ApolloClient({
        uri: 'http://localhost:4000/graphql',
        cache: new InMemoryCache()
    });

    return (
        <>
            <ApolloProvider client={client}>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<BudgetSheet />} />
                        <Route path='/settings' element={<Settings />} />
                        <Route path='/json/:spreadsheetId' element={<JSONView />} />
                        <Route path='/md/:spreadsheetId' element={<MDView />} />
                        <Route path='/api/:spreadsheetId' element={<ApiView />} />
                    </Routes>
                </Router>
            </ApolloProvider>
        </>

    )
};