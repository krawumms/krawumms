import React, { FunctionComponent, useContext, useCallback } from 'react';

import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  IconButton,
  Stack,
  Text,
  PseudoBox,
} from '@chakra-ui/core';
import Link from 'next/link';

import { mutate } from 'swr';
import { Party } from '../../interfaces';
import config from '../../config';
import fetcher from '../../util/fetcher';
import { PartyContext } from '../../contexts/PartyContext';

type Props = {
  party: Party;
};

const PartyListItem: FunctionComponent<Props> = ({ party, ...rest }) => {
  const { name, topic, id } = party;
  const { partyId, setCurrentPartyId } = useContext(PartyContext);

  const onSelectClick = useCallback(() => {
    setCurrentPartyId(id);
  }, [id, setCurrentPartyId]);

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
  }, [id, partyState.name, partyState.topic]);

  return (
    <PseudoBox
      backgroundColor="#eee"
      _hover={{ bg: '#ddd' }}
      padding="16px"
      borderRadius="1em"
      display={{ md: 'flex' }}
      alignItems="center"
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...rest}
    >
      <Box
        display="inline-block"
        width={[
          '80%', // base
          '100%', // 480px upwards
          '70%', // 768px upwards
          '80%', // 992px upwards
        ]}
      >
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
          <Text>{id}</Text>
        </Stack>
      </Box>
      <Box
        display="inline-block"
        width={[
          '20%', // base
          '100%', // 480px upwards
          '30%', // 768px upwards
          '20%', // 992px upwards
        ]}
      >
        {partyId === id ? (
          <IconButton
            variantColor="yellow"
            aria-label="Select Party"
            size="lg"
            icon="star"
            variant="solid"
            padding="8px"
            marginRight="8px"
          />
        ) : (
          <IconButton
            variantColor="yellow"
            aria-label="Select Party"
            size="lg"
            icon="star"
            variant="outline"
            onClick={onSelectClick}
            padding="8px"
            marginRight="8px"
          />
        )}
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
    </PseudoBox>
  );
};

export default PartyListItem;
