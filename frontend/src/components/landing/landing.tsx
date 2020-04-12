import React, { FunctionComponent, useCallback } from 'react';
import { Box, Button, Flex, Input, Stack, Text } from '@chakra-ui/core';
import { useRouter } from 'next/router';

const Landing: FunctionComponent = () => {
  const { push } = useRouter();
  const onCreateClick = useCallback(() => {
    push('/parties');
  }, [push]);

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
            <Input variant="filled" placeholder="Party Code" />
            <Button variantColor="green">Join Party</Button>
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
