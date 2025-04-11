/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_URL: string;
  VITE_JS_API_KEY: string;
  VITE_JS_API_SECRET: string;
  VITE_WEB_API_KEY: string;
  VITE_MAP_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
