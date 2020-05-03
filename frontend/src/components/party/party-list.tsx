import React, { FunctionComponent } from 'react';

import { Stack, Box, Text, Icon } from '@chakra-ui/core';

import PartyListItem from './party-list-item';
import { Party } from '../../interfaces';

type Props = {
  parties: Party[];
};

const PartyList: FunctionComponent<Props> = ({ parties, ...props }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Stack spacing="8px" flex="1" overflowY="auto" maxHeight="500px" {...props}>
    {Array.isArray(parties) && parties.map((party) => <PartyListItem key={party.id} party={party} />)}
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
  </Stack>
);

export default PartyList;
