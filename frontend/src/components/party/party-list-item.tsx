import React, { FunctionComponent, useCallback, useState } from 'react';

import { Editable, EditableInput, EditablePreview, Flex, Heading, IconButton, Image, Text } from '@chakra-ui/core';
import Link from 'next/link';
import { Party } from '../../interfaces';

type Props = {
  party: Party;
  onModifyParty: (id: string, values: { name: string; topic: string }) => void;
  onPartyDelete: (id: string) => void;
};

const PartyListItem: FunctionComponent<Props> = ({ party, onPartyDelete, onModifyParty }) => {
  const [partyState, setPartyState] = useState(party);
  const { name, topic, id, code } = party;

  const onDeleteClick = useCallback(async () => {
    onPartyDelete(id);
  }, [id, onPartyDelete]);

  const handleChangeSubmit = useCallback(async () => {
    onModifyParty(id, partyState);
  }, [id, partyState, onModifyParty]);

  const handleTopicChange = useCallback(
    (newTopic: string) => {
      setPartyState({
        ...partyState,
        topic: newTopic,
      });
    },
    [partyState, setPartyState],
  );

  const handleNameChange = useCallback(
    (newName: string) => {
      setPartyState({
        ...partyState,
        topic: newName,
      });
    },
    [partyState, setPartyState],
  );

  return (
    <Flex
      padding="16px"
      borderRadius="3px"
      display="flex"
      alignItems="center"
      flexDirection="column"
      boxShadow="0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06)"
      backgroundColor="#ffffff"
    >
      <Image height="64px" width="64px" src={`https://avatars.dicebear.com/api/jdenticon/${party.id}.svg`} />
      <Flex padding="8px 16px" flex="1" justifyContent="center" alignItems="center" flexDirection="column" width="100%">
        <Heading fontSize="xl">
          <Editable defaultValue={name} onChange={handleNameChange} onSubmit={handleChangeSubmit}>
            <EditableInput />
            <EditablePreview />
          </Editable>
        </Heading>
        <Editable defaultValue={topic} onChange={handleTopicChange} onSubmit={handleChangeSubmit}>
          <EditableInput />
          <EditablePreview />
        </Editable>
        <Text>Code: {code}</Text>
      </Flex>
      <Flex>
        <IconButton
          variantColor="red"
          aria-label="Delete Party"
          size="lg"
          icon="delete"
          onClick={onDeleteClick}
          margin="8px"
        />
        <Link href="/parties/[id]" as={`/parties/${id}`}>
          <IconButton variantColor="green" aria-label="Delete Party" size="lg" icon="search" margin="8px" />
        </Link>
      </Flex>
    </Flex>
  );
};

export default PartyListItem;
