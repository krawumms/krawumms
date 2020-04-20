import React, { FunctionComponent, useCallback } from 'react';
import { Box, Heading, IconButton, Image, Stack, Text } from '@chakra-ui/core';
import useSWR, { mutate } from 'swr';
import { Party, Track } from '../../interfaces';
import fetcher from '../../util/fetcher';
import config from '../../config';
import Search from './search';
import PartyIcon from '../../icons/party.svg';

type Props = {
  party: Party;
};

type PlaylistTrack = {
  id: string;
  votes: number;
};

const PartyComponent: FunctionComponent<Props> = ({ party }) => {
  const { id, name, topic, createdAt, updatedAt, code } = party;
  const { data: playlist } = useSWR<PlaylistTrack[]>(`${config.apiBaseUrl}/parties/${id}/playlist`, fetcher, {
    refreshInterval: 1000,
  });

  if (playlist) {
    playlist.sort((a, b) => b.votes - a.votes);
  }
  const trackIds = playlist && playlist.map((track) => track.id);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { data: tracks } = useSWR<Track[]>(() => `${config.apiBaseUrl}/tracks?ids=${trackIds.toString()}`, fetcher);

  const onDownVote = useCallback(
    async (trackId) => {
      await mutate(`${config.apiBaseUrl}/parties/${id}/playlist`, async () => {
        const result = await fetcher(`${config.apiBaseUrl}/parties/${id}/playlist/${trackId}/down-vote`, {
          method: 'PUT',
          body: JSON.stringify({}),
        });
        return result.playlist;
      });
    },
    [id],
  );

  const onUpVote = useCallback(
    async (trackId) => {
      await mutate(`${config.apiBaseUrl}/parties/${id}/playlist`, async () => {
        const result = await fetcher(`${config.apiBaseUrl}/parties/${id}/playlist/${trackId}/up-vote`, {
          method: 'PUT',
          body: JSON.stringify({}),
        });
        return result.playlist;
      });
    },
    [id],
  );

  return (
    <Box padding="16px" display="flex" flexDirection="column" alignItems="center">
      <Box>
        <PartyIcon />
        <Heading as="h1" size="xl">
          {name}
        </Heading>
        <Stack spacing="4px">
          <Text>{topic}</Text>
          <Text>Code: {code}</Text>
          <Text>{createdAt}</Text>
          <Text>{updatedAt}</Text>
        </Stack>
      </Box>
      <Search />
      {Array.isArray(tracks) && Boolean(tracks.length) && (
        <Stack
          width={['100%', '75%', '50%']}
          backgroundColor="#EDF2F7"
          maxHeight="500px"
          overflowY="auto"
          padding="8px"
        >
          {tracks.map(({ name: trackName, id: trackId, artists, album: { images } }) => {
            const { url } = images.find(({ height }) => height === 64) || {};
            const playlistTrack = playlist && playlist.find((pT) => pT.id === trackId);
            return (
              <Box
                key={trackId}
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
                <Box flex="1">
                  <Heading as="h2" size="md">
                    {trackName}
                  </Heading>

                  {/* to remove, only for dev/debug */}
                  <Text>{trackId}</Text>
                  {playlistTrack && <Text> Votes: {playlistTrack.votes} </Text>}
                  <Text>{artists.map((artist) => artist.name).join(', ')}</Text>
                </Box>
                <Box>
                  <IconButton
                    variantColor="green"
                    aria-label="Up-vote Track"
                    size="lg"
                    icon="arrow-up"
                    onClick={() => onUpVote(trackId)}
                    padding="8px"
                    margin="8px"
                  />
                  <IconButton
                    variantColor="red"
                    aria-label="Down-vote Track"
                    size="lg"
                    icon="arrow-down"
                    onClick={() => onDownVote(trackId)}
                    padding="8px"
                    margin="8px"
                  />
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
