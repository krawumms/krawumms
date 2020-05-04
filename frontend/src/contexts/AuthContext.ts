import { createContext } from 'react';

export type AuthContext = {
  accessToken: {
    token_type: string | undefined;
    access_token: string | undefined;
  };
  user: {
    id: string | undefined;
  };
};

export const AUTH_DEFAULT_VALUE = {
  accessToken: {
    token_type: undefined,
    access_token: undefined,
  },
  user: {
    id: undefined,
  },
};

export const AuthContext = createContext<AuthContext>(AUTH_DEFAULT_VALUE);
export const AuthProvider = AuthContext.Provider;
