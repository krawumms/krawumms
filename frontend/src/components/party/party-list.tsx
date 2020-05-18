import React, { FunctionComponent } from 'react';

import { Box, Grid, Icon, Text } from '@chakra-ui/core';

import PartyListItem from './party-list-item';
import { Party } from '../../interfaces';

type Props = {
  parties: Party[];
  onModifyParty: (id: string, values: { name: string; topic: string }) => void;
  onPartyDelete: (id: string) => void;
};

const PartyList: FunctionComponent<Props> = ({ parties, onPartyDelete, onModifyParty }) => (
  <Grid
    gap="8px"
    gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))"
    padding="8px"
    backgroundColor="#d8d8d8"
    width="100%"
  >
    {Array.isArray(parties) &&
      parties.map((party) => (
        <PartyListItem key={party.id} party={party} onPartyDelete={onPartyDelete} onModifyParty={onModifyParty} />
      ))}
    {!parties.length && (
      <Box
        background="#ffffff"
        width="100%"
        padding="16px"
        boxShadow="md"
        borderRadius="2px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Icon name="info-outline" size="32px" margin="16px" />
        <Text textAlign="center">No Parties found</Text>
      </Box>
    )}
  </Grid>
);

export default PartyList;
