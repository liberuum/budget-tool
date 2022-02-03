import React from 'react';
import Settings from './components/settings'
import Navbar from './components/navbar';
import BudgetSheet from './components/budgetSheet';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import JSONView from './components/exportJSONview';
import MDView from './components/exportMDview';


export default function App() {

    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path='/' element={<BudgetSheet />} />
                    <Route path='/settings' element={<Settings />} />
                    <Route path='/json/:spreadSheetId' element={<JSONView />} />
                    <Route path='/md/:spreadSheetId' element={<MDView />} />
                </Routes>

            </Router>
        </>

    )
};