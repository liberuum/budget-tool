import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { ThemeProvider } from 'theme-ui';
import theme from '@makerdao/dai-ui-theme-maker';
import { Provider } from 'react-redux';
import configureStore from './store'

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}><App /></ThemeProvider>
    </Provider>
    , document.getElementById('app'));