import React, { FunctionComponent, useCallback, useContext } from 'react';
import { Box, Button, Flex, Stack, Text } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { Form } from 'react-final-form';
import InputControl from '../form/input-control';
import config from '../../config';
import fetcher from '../../util/fetcher';
import { PartyContext } from '../../contexts/PartyContext';

const Landing: FunctionComponent = () => {
  const { push } = useRouter();
  const { setCurrentPartyId } = useContext(PartyContext);
  const onCreateClick = useCallback(() => {
    push('/parties');
  }, [push]);

  const handleFormSubmit = useCallback(
    async (values) => {
      const { code } = values;
      try {
        const party = await fetcher(`${config.apiBaseUrl}/parties/byCode/${code}`, { method: 'GET' });
        if (party && party.id) {
          setCurrentPartyId(party.id);
          push('/parties/[id]', `/parties/${party.id}`);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [push, setCurrentPartyId],
  );

  return (
    <div className="landing">
      <Flex align="center" justify="center" flex="1">
        <Box
          bg="gray.50"
          width={['100%', '65%', '50%', '40%', '30%']}
          position="relative"
          borderRadius="2px"
          boxShadow="md"
          padding="32px"
          paddingTop="98px"
        >
          <Box
            height="128px"
            width="128px"
            bg="gray.50"
            position="absolute"
            top="-64px"
            left="calc(50% - 64px)"
            borderRadius="50%"
            boxShadow="md"
          >
            <img src="/krawumms-logo.png" alt="logo" />
          </Box>
          <Text textAlign="center" padding="16px 0">
            Krawumms lets your guests choose which music should be played using their smartphones.
          </Text>
          <Stack>
            <Box display="flex" flexDirection="column">
              <Form onSubmit={handleFormSubmit}>
                {({ handleSubmit, submitting }) => (
                  <Box display="flex" flexDirection="column" as="form" onSubmit={handleSubmit}>
                    <InputControl variant="filled" placeholder="Party Code" required name="code" />
                    <Button isLoading={submitting} loadingText="Submitting" variantColor="green" type="submit">
                      Join Party
                    </Button>
                  </Box>
                )}
              </Form>
            </Box>
            <Button onClick={onCreateClick}>Create Party</Button>
          </Stack>
        </Box>
      </Flex>

      <style jsx>
        {`
          .landing {
            background: linear-gradient(#1c1f24e6, #1c1f24e6), url(/background.jpg) no-repeat center;

            min-height: 100vh;
            height: 100%;
            width: 100vw;

            display: flex;

            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
          }
        `}
      </style>
    </div>
  );
};

export default Landing;
