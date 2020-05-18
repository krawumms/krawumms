import { createContext } from 'react';

export type TokenContext = {
  accessToken: string | null;
};

export const DEFAULT_VALUE = {
  accessToken: null,
};

export const TokenContext = createContext<TokenContext>(DEFAULT_VALUE);
export const TokenProvider = TokenContext.Provider;
