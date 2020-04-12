import React, { FunctionComponent } from 'react';
import { Box, Heading, Stack } from '@chakra-ui/core';
import PartyCreate from './party-create';
import PartyList from './party-list';
import { Party } from '../../interfaces';

type Props = {
  parties: Party[];
};

const Parties: FunctionComponent<Props> = ({ parties }) => (
  <Box padding="16px">
    <Heading as="h1" size="xl" marginBottom="16px">
      My Parties
    </Heading>
    <Stack isInline spacing="8px" padding="8px" backgroundColor="#e5e5e5">
      <PartyList parties={parties} />
      <PartyCreate />
    </Stack>
  </Box>
);

export default Parties;
