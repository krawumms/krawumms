import { createContext } from 'react';

export type AuthContext = {
  accessToken: string;
};

export const AUTH_DEFAULT_VALUE = {
  accessToken: '',
};

export const AuthContext = createContext<AuthContext>(AUTH_DEFAULT_VALUE);
export const AuthProvider = AuthContext.Provider;
