import React, { FunctionComponent, useCallback } from 'react';

import { Box, Heading, IconButton, Stack, Text } from '@chakra-ui/core';
import Link from 'next/link';

import { Party } from '../../interfaces';
import { mutate } from 'swr';
import config from '../../config';
import fetcher from '../../util/fetcher';

type Props = {
  party: Party;
};

const PartyListItem: FunctionComponent<Props> = ({ party, ...rest }) => {
  const { name, topic, id } = party;
  const onDeleteClick = useCallback(async () => {
    await mutate(`${config.apiBaseUrl}/parties`, async (parties: Party[]) => {
      await fetcher(`${config.apiBaseUrl}/parties/${id}`, { method: 'DELETE' });
      return [...parties.filter((party) => party.id !== id)];
    });
  }, [mutate]);
  return (
    <Box
      backgroundColor="#ffffff"
      padding="16px"
      boxShadow="md"
      display="flex"
      borderRadius="2px"
      alignItems="center"
      {...rest}
    >
      <Box
        flex="1"
        padding="16px"
      >
        <Stack
          spacing="4px"
        >
          <Heading
            fontSize="xl"
          >
            {name}
          </Heading>
          <Text>
            {topic}
          </Text>
        </Stack>
      </Box>
      <IconButton
        variantColor="red"
        aria-label="Delete Party"
        size="lg"
        icon="delete"
        onClick={onDeleteClick}
        padding="8px"
      />
      <Link href="/parties/[id]" as={`/parties/${id}`}>
        <Box
          as="a"
          padding="8px"
        >
          <IconButton
            variantColor="green"
            aria-label="Delete Party"
            size="lg"
            icon="search"
          />
        </Box>
      </Link>
    </Box>
  );
};

export default PartyListItem;
