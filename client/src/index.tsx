import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './components/App';

import { Auth0Provider } from '@auth0/auth0-react';

const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin + '/post-login',
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
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
