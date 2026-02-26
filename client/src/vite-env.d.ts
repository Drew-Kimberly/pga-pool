/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_AUDIENCE: string;
  readonly VITE_PGA_POOL_API_URL: string;
  readonly VITE_AUTH_ENABLED: string;
  readonly VITE_METICULOUS_RECORDING_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
