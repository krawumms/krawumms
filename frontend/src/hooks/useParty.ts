import { useState, useCallback } from 'react';
import { PartyContext } from '../contexts/PartyContext';

const useParty = (): PartyContext => {
  const [partyId, setPartyId] = useState(0);

  const setCurrentPartyId = useCallback(
    (currentPartyId: number): void => {
      setPartyId(currentPartyId);
    },
    [setPartyId],
  );

  return {
    partyId,
    setCurrentPartyId,
  };
};

export default useParty;
