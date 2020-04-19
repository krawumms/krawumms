import React, { FunctionComponent, useCallback } from 'react';

import { Box, Editable, EditableInput, EditablePreview, Heading, IconButton, Stack, Text } from '@chakra-ui/core';
import Link from 'next/link';

import { mutate } from 'swr';
import { Party } from '../../interfaces';
import config from '../../config';
import fetcher from '../../util/fetcher';

type Props = {
  party: Party;
};

const PartyListItem: FunctionComponent<Props> = ({ party, ...rest }) => {
  const { name, topic, id } = party;
  const [partyState] = React.useState(party);
  const onDeleteClick = useCallback(async () => {
    await mutate(`${config.apiBaseUrl}/parties`, async (parties: Party[]) => {
      await fetcher(`${config.apiBaseUrl}/parties/${id}`, { method: 'DELETE' });
      return [...parties.filter((_party) => _party.id !== id)];
    });
  }, [id]);

  const handleChangeSubmit = useCallback(async () => {
    await mutate(`${config.apiBaseUrl}/parties`, async (parties: Party[]) => {
      await fetcher(`${config.apiBaseUrl}/parties/${id}`, {
        method: 'PUT',
        body: `{"name":"${partyState.name}","topic":"${partyState.topic}"}`,
      });
      return [...parties.filter((_party) => _party.id !== id)];
    });
  }, [id]);

  return (
    <Box
      backgroundColor="#ffffff"
      padding="16px"
      boxShadow="md"
      display="flex"
      borderRadius="2px"
      alignItems="center"
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...rest}
    >
      <Box flex="1" padding="16px">
        <Stack spacing="4px">
          <Heading fontSize="xl">
            <Editable
              defaultValue={name}
              onChange={(e) => {
                partyState.name = e.toString();
              }}
              onSubmit={handleChangeSubmit}
            >
              <EditableInput />
              <EditablePreview />
            </Editable>
          </Heading>
          <Text>
            <Editable
              defaultValue={topic}
              onChange={(e) => {
                partyState.topic = e.toString();
              }}
              onSubmit={handleChangeSubmit}
            >
              <EditableInput />
              <EditablePreview />
            </Editable>
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
        <Box as="a" padding="8px">
          <IconButton variantColor="green" aria-label="Delete Party" size="lg" icon="search" />
        </Box>
      </Link>
    </Box>
  );
};

export default PartyListItem;
