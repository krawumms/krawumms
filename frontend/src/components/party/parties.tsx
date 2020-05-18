import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/core';
import useFetch from 'use-http';
import { Form } from 'react-final-form';
import PartyList from './party-list';
import InputControl from '../form/input-control';
import { Party } from '../../interfaces';
import MusicIcon from '../../icons/music.svg';

const Parties: FunctionComponent = () => {
  const [parties, setParties] = useState<Array<Party>>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { get, post, response, del, put, loading, error } = useFetch('/parties');

  const loadParties = useCallback(async () => {
    const partiesToStore = await get();
    if (response.ok) setParties(partiesToStore);
  }, [get, response]);

  const handleCreateParty = useCallback(
    async (values: { name: string; topic: string }) => {
      const newParty = await post(values);
      if (response.ok) {
        setParties([...parties, newParty]);
        onClose();
      }
    },
    [parties, post, response, onClose],
  );

  const handleDeleteParty = useCallback(
    async (partyId: string) => {
      await del(`/${partyId}`);
      if (response.ok) {
        setParties([...parties.filter((party) => party.id !== partyId)]);
      }
    },
    [parties, del, response],
  );

  const handleModifyParty = useCallback(
    async (partyId: string, values: { name: string; topic: string }) => {
      const modified = await put(`/${partyId}`, values);
      if (response.ok) {
        setParties([
          ...parties.map((party) => {
            if (party.id === partyId) {
              return modified;
            }
            return party;
          }),
        ]);
      }
    },
    [parties, put, response],
  );

  useEffect(() => {
    loadParties();
  }, [loadParties]);

  return (
    <Flex padding="16px" width="100%" justifyContent="center" flexDirection="column">
      <Flex position="relative" flexDirection="column" width="100%">
        <Heading as="h1" size="xl" marginBottom="16px" textAlign="center">
          My Parties
        </Heading>
        <MusicIcon className="music-icon" />
        <Button
          variant="solid"
          variantColor="green"
          alignSelf="center"
          onClick={onOpen}
          rightIcon="small-add"
          marginBottom="16px"
        >
          Create Party
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <Form onSubmit={handleCreateParty}>
          {({ handleSubmit, form, submitting, pristine }) => (
            <form onSubmit={handleSubmit}>
              <ModalContent>
                <ModalHeader>Create a new party</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <InputControl name="name" label="Name" required />
                  <InputControl name="topic" label="Topic" required />
                </ModalBody>
                <ModalFooter>
                  <ButtonGroup spacing={4}>
                    <Button isLoading={submitting} loadingText="Submitting" variantColor="green" type="submit">
                      Create Party
                    </Button>
                    <Button
                      variantColor="teal"
                      variant="outline"
                      onClick={form.reset}
                      isDisabled={submitting || pristine}
                    >
                      Reset
                    </Button>
                  </ButtonGroup>
                </ModalFooter>
              </ModalContent>
            </form>
          )}
        </Form>
      </Modal>
      <Heading as="h2" size="lg" marginBottom="16px">
        Ongoing parties
      </Heading>
      {error && 'Error!'}
      {loading && !parties && 'Loading...'}
      <PartyList parties={parties} onModifyParty={handleModifyParty} onPartyDelete={handleDeleteParty} />

      <style jsx>
        {`
          :global(.music-icon) {
            height: 128px;
            width: 128px;
            margin-bottom: 16px;
            align-self: center;
          }
        `}
      </style>
    </Flex>
  );
};

export default Parties;
