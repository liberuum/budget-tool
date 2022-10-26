import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import { ThemeProvider } from 'theme-ui';
import theme from '@makerdao/dai-ui-theme-maker';
import { Provider } from 'react-redux';
import configureStore from './store'

const store = configureStore();

const root = createRoot(document.getElementById('app'));
root.render(<Provider store={store}>
    <ThemeProvider theme={theme}><App /></ThemeProvider>
</Provider>);
