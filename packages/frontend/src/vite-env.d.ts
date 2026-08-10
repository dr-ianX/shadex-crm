/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly glob: ImportMetaGlob;
}

declare global {
  var __vite_plugin_react_preamble_installed__: boolean | undefined;
}

declare const importMeta: {
  readonly env: ImportMetaEnv;
  readonly glob: ImportMetaGlob;
};

interface ImportMetaEnv {
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly VITE_API_URL?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_APP_DESCRIPTION?: string;
  readonly VITE_APP_LOGO?: string;
}

interface ImportMetaGlob {
  readonly [moduleName: string]: any;
}