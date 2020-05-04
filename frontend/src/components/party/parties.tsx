import React, { FunctionComponent } from 'react';
import { Box, Heading, Stack } from '@chakra-ui/core';
import PartyCreate from './party-create';
import PartyList from './party-list';
import { Party } from '../../interfaces';

type Props = {
  parties: Party[];
};

const Parties: FunctionComponent<Props> = ({ parties }) => (
  <Box padding="16px" width="100%">
    <Heading as="h1" size="xl" marginBottom="16px" textAlign="center">
      My Parties
    </Heading>
    <Stack spacing="8px" padding="8px" backgroundColor="none">
      <Heading as="h4" size="lg">
        Create a new party
      </Heading>
      <PartyCreate />
      <Heading as="h4" size="lg">
        Ongoing parties
      </Heading>
      <PartyList parties={parties} />
    </Stack>
  </Box>
);

export default Parties;
