import React from 'react';
import Settings from './components/settings'
import Navbar from './components/navbar';
import BudgetSheet from './components/budgetSheet';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import JSONView from './components/exportJSONview';
import MDView from './components/exportMDview';
import {
    ApolloClient, InMemoryCache, ApolloProvider
} from "@apollo/client";

export default function App() {

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
                    </Routes>
                </Router>
            </ApolloProvider>
        </>

    )
};