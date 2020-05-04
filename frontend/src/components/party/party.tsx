import React, { FunctionComponent, useCallback, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Box, Heading, IconButton, Image, Stack, Text } from '@chakra-ui/core';
import useSWR, { mutate } from 'swr';
import { Party, Track } from '../../interfaces';
import fetcher from '../../util/fetcher';
import config from '../../config';
import Search from './search';
import PartyIcon from '../../icons/party.svg';
import useLocalStorage from '../../hooks/use-localstorage';
import { AuthContext } from '../../contexts/AuthContext';

type Props = {
  party: Party;
};

type PlaylistTrack = {
  id: string;
  votes: [string];
};

const PartyComponent: FunctionComponent<Props> = ({ party }) => {
  const { id, name, topic, createdAt, updatedAt, code, ownerId } = party;
  const { user } = useContext(AuthContext);
  const { data: playlist } = useSWR<PlaylistTrack[]>(`${config.apiBaseUrl}/parties/${id}/playlist`, fetcher, {
    refreshInterval: 1000,
  });
  const isOwner = user && user.id === ownerId;
  const [clientUuid, setClientUuid] = useLocalStorage('clientUuid');
  if (!clientUuid) {
    setClientUuid(uuidv4());
  }

  if (playlist && playlist.length) {
    playlist.sort((a, b) => b.votes.length - a.votes.length);
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
          headers: {
            'x-krawumms-client': clientUuid,
          },
        });
        return result.playlist;
      });
    },
    [id, clientUuid],
  );

  const onUpVote = useCallback(
    async (trackId) => {
      await mutate(`${config.apiBaseUrl}/parties/${id}/playlist`, async () => {
        const result = await fetcher(`${config.apiBaseUrl}/parties/${id}/playlist/${trackId}/up-vote`, {
          method: 'PUT',
          body: JSON.stringify({}),
          headers: {
            'x-krawumms-client': clientUuid,
          },
        });
        return result.playlist;
      });
    },
    [id, clientUuid],
  );

  const onDeleteClick = useCallback(
    async (trackId: string) => {
      await mutate(`${config.apiBaseUrl}/parties/${id}/playlist`, async () => {
        const result = await fetcher(`${config.apiBaseUrl}/parties/${id}/playlist`, {
          method: 'DELETE',
          body: JSON.stringify({ id: trackId }),
        });
        return result.playlist;
      });
    },
    [id],
  );
  return (
    <Box padding="16px" display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
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
            const hasAlreadyVoted = playlistTrack && playlistTrack.votes.includes(clientUuid);
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
                  {playlistTrack && <Text> Votes: {playlistTrack.votes.length} </Text>}
                  <Text>{artists.map((artist) => artist.name).join(', ')}</Text>
                </Box>
                <Box>
                  <IconButton
                    variantColor="yellow"
                    aria-label="Select Party"
                    size="lg"
                    icon="star"
                    variant={hasAlreadyVoted ? 'solid' : 'outline'}
                    padding="8px"
                    marginRight="8px"
                    onClick={() => {
                      if (hasAlreadyVoted) {
                        onDownVote(trackId);
                      } else {
                        onUpVote(trackId);
                      }
                    }}
                  />
                  {isOwner && (
                    <IconButton
                      variantColor="red"
                      aria-label="Delete Song"
                      size="lg"
                      icon="delete"
                      onClick={() => onDeleteClick(trackId)}
                      padding="8px"
                      margin="8px"
                    />
                  )}
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
