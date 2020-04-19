import React from 'react';
import { PartyContext } from '../contexts/PartyContext';

const useParty = (): PartyContext => {
  const [partyId, setPartyId] = React.useState(0);

  const setCurrentPartyId = React.useCallback((currentPartyId: number): void => {
    setPartyId(currentPartyId);
  }, []);

  return {
    partyId,
    setCurrentPartyId,
  };
};

export default useParty;
