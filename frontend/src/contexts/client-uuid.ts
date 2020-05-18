import { createContext } from 'react';

export type ClientUuidContext = {
  clientUuid: string | null;
};

export const DEFAULT_VALUE = {
  clientUuid: null,
};

export const ClientUuidContext = createContext<ClientUuidContext>(DEFAULT_VALUE);
export const ClientUuidProvider = ClientUuidContext.Provider;
