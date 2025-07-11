import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './components/App';
import reportWebVitals from './reportWebVitals';

import { Auth0Provider } from '@auth0/auth0-react';

const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN!,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
  authorizationParams: {
    redirect_uri: window.location.origin + '/post-login',
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    scope: 'openid profile email',
  },
  useRefreshTokens: true,
  cacheLocation: 'localstorage' as const,
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Add error handler for Auth0
const onRedirectCallback = (appState?: { returnTo?: string }) => {
  window.history.replaceState({}, document.title, appState?.returnTo || window.location.pathname);
};

root.render(
  <React.StrictMode>
    <Auth0Provider {...auth0Config} onRedirectCallback={onRedirectCallback}>
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
