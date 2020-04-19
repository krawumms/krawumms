import { createContext } from 'react';

export type PartyContext = {
  partyId: number;
  setCurrentPartyId: (party: number) => void;
};

export const PARTY_DEFAULT_VALUE = {
  partyId: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentPartyId: () => {},
};

export const PartyContext = createContext<PartyContext>(PARTY_DEFAULT_VALUE);
export const PartyProvider = PartyContext.Provider;
