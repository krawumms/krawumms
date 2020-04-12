import React, { FunctionComponent } from 'react';
import { Box, Heading, Stack, Text } from '@chakra-ui/core';
import { Party } from '../../interfaces';

type Props = {
  party: Party;
};

const PartyComponent: FunctionComponent<Props> = ({ party }) => {
  const { name, topic, createdAt, updatedAt } = party;
  return (
    <Box padding="16px">
      <Heading as="h1" size="xl">
        {name}
      </Heading>
      <Stack spacing="4px">
        <Text>{topic}</Text>
        <Text>{createdAt}</Text>
        <Text>{updatedAt}</Text>
      </Stack>
    </Box>
  );
};

export default PartyComponent;
