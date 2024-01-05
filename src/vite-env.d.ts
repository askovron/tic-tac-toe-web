/// <reference types="@welldone-software/why-did-you-render" />
/// <reference types="vite/client" />

declare module "react-dom/client";

type TCellState = "X" | "O" | "";

type TGameRoom = {
  host: string;
  guest?: string;
  lastMove?: string;
  gameState: TCellState[];
};

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_DB_URL: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_CURRENT_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
