import React from 'react';
import ReactDOM from 'react-dom';

import { StoreProvider } from './storeLib';
import './index.css';
import App from './App';
import store from './store/';
//import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>,
  document.getElementById('root')
);
//registerServiceWorker();
