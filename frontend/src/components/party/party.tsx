import React, { FunctionComponent } from 'react';
import { Box, Heading, Image, Stack, Text } from '@chakra-ui/core';
import useSWR from 'swr';
import { Party, Track } from '../../interfaces';
import fetcher from '../../util/fetcher';
import config from '../../config';

type Props = {
  party: Party;
};

const PartyComponent: FunctionComponent<Props> = ({ party }) => {
  const { id, name, topic, createdAt, updatedAt } = party;
  const { data: playlist } = useSWR<string[]>(`${config.apiBaseUrl}/parties/${id}/playlist`, fetcher);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { data: tracks } = useSWR<Track[]>(() => `${config.apiBaseUrl}/tracks?ids=${playlist.toString()}`, fetcher);

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
      {Array.isArray(tracks) && Boolean(tracks.length) && (
        <Stack
          width={['100%', '75%', '50%']}
          backgroundColor="#EDF2F7"
          maxHeight="500px"
          overflowY="auto"
          padding="8px"
        >
          {tracks.map(({ name: trackName, id, artists, album: { images } }) => {
            const { url } = images.find(({ height }) => height === 64) || {};
            return (
              <Box
                key={id}
                backgroundColor="#ffffff"
                padding="16px"
                boxShadow="lg"
                display="flex"
                borderRadius="2px"
                alignItems="center"
              >
                <Image
                  fallbackSrc="https://via.placeholder.com/64"
                  src={url}
                  alt={`Album cover: ${trackName}`}
                  marginRight="16px"
                />
                <Box>
                  <Heading as="h2" size="md">
                    {trackName}
                  </Heading>

                  {/* to remove, only for dev/debug */}
                  <Text>{id}</Text>

                  <Text>{artists.map((artist) => artist.name).join(', ')}</Text>
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default PartyComponent;
