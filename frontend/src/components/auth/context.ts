import { createContext } from 'react';

const AuthContext = createContext({ accessToken: null });

export const { Provider, Consumer } = AuthContext;
