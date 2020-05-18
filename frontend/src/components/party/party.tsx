import React, { FunctionComponent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Box, Button, Flex, Heading, IconButton, Image, Stack, Text } from '@chakra-ui/core';
import useFetch from 'use-http/dist';
import NextLink from 'next/link';
import { Party, Track } from '../../interfaces';
import Search from './search';
import PartyIcon from '../../icons/party.svg';
import { ClientUuidContext } from '../../contexts/client-uuid';
import useInterval from '../../hooks/use-interval';

type Props = {
  party: Party;
};

type PlaylistTrack = {
  id: string;
  votes: [string];
};

type User = {
  id: string;
};

const PartyComponent: FunctionComponent<Props> = ({ party }) => {
  const { id, name, topic, createdAt, updatedAt, code, ownerId } = party;
  const { clientUuid } = useContext(ClientUuidContext);
  const [songs, setSongs] = useState<PlaylistTrack[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const { get, response, put, del } = useFetch(`/parties/${id}/playlist`);
  const { get: getUser, response: userResponse } = useFetch('/me');

  const { get: getSongs, response: responseSongs } = useFetch('/tracks');

  const loadUser = useCallback(async () => {
    try {
      const userToStore = await getUser();
      if (userResponse.ok) setUser(userToStore);
    } catch (e) {
      // do nothing
    }
  }, [getUser, userResponse]);

  const loadPlaylist = useCallback(async () => {
    const songsToStore = await get();
    if (response.ok) setSongs(songsToStore);
  }, [get, response]);

  const isOwner = ownerId === user?.id;

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (songs && songs.length) {
    songs.sort((a, b) => b.votes.length - a.votes.length);
  }

  const songIds = useMemo(() => (songs && songs.map((song) => song.id)) || [], [songs]);

  const loadTracks = useCallback(
    async (searchIds: string[]) => {
      const tracksToStore = await getSongs(`?ids=${searchIds.toString()}`);
      if (responseSongs.ok) setTracks(tracksToStore);
    },
    [getSongs, responseSongs, setTracks],
  );

  useEffect(() => {
    loadTracks(songIds);
  }, [loadTracks, songIds]);

  useInterval(() => {
    loadPlaylist();
  }, 3000);

  const onDownVote = useCallback(
    async (trackId) => {
      const result = await put(`/${trackId}/down-vote`, {});
      if (response.ok) setSongs(result.playlist);
    },
    [response, put, setSongs],
  );

  const onUpVote = useCallback(
    async (trackId) => {
      const result = await put(`/${trackId}/up-vote`, {});
      if (response.ok) setSongs(result.playlist);
    },
    [response, put, setSongs],
  );

  const onDeleteClick = useCallback(
    async (trackId) => {
      const result = await del({ id: trackId });
      if (response.ok) setSongs(result);
    },
    [response, del, setSongs],
  );
  const onAddClick = useCallback(
    async (trackId: string) => {
      const result = await put({ id: trackId });
      if (response.ok) setSongs(result.playlist);
    },
    [response, put, setSongs],
  );
  return (
    <Box padding="16px" display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <PartyIcon className="party-icon" />
        <Heading as="h1" size="xl">
          {name}
        </Heading>
        <Stack spacing="4px">
          <Text>{topic}</Text>
          <Text>Code: {code}</Text>
          <Text>{createdAt}</Text>
          <Text>{updatedAt}</Text>
        </Stack>
        <NextLink href="/parties/[id]/player" as={`/parties/${id}/player`}>
          <Button display="flex" alignItems="center">
            Go to Player
          </Button>
        </NextLink>
      </Box>
      <Search onAddClick={onAddClick} />
      {Array.isArray(tracks) && Boolean(tracks.length) && (
        <Stack
          width={['100%', '75%', '50%']}
          backgroundColor="#EDF2F7"
          maxHeight="500px"
          overflowY="auto"
          padding="8px"
        >
          {tracks.filter(Boolean).map(({ name: trackName, id: trackId, artists, album: { images } }) => {
            const { url } = images.find(({ height }) => height === 64) || {};
            const playlistTrack = songs && songs.find((pT) => pT.id === trackId);
            const hasAlreadyVoted = clientUuid && playlistTrack && playlistTrack.votes.includes(clientUuid);
            return (
              <Flex
                key={trackId}
                backgroundColor="#ffffff"
                padding="16px"
                boxShadow="lg"
                flexDirection={{ base: 'column', md: 'row' }}
                borderRadius="2px"
                alignItems="center"
              >
                <Image
                  fallbackSrc="https://via.placeholder.com/64"
                  src={url}
                  alt={`Album cover: ${trackName}`}
                  margin="16px"
                />
                <Box flex="1">
                  <Heading as="h2" size="md">
                    {trackName}
                  </Heading>
                  <Text>{artists.map((artist) => artist.name).join(', ')}</Text>
                  {playlistTrack && <Text> Votes: {playlistTrack.votes.length} </Text>}
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
              </Flex>
            );
          })}
          <style jsx>
            {`
              :global(.party-icon) {
                height: 128px;
                width: 128px;
                margin-bottom: 16px;
              }
            `}
          </style>
        </Stack>
      )}
    </Box>
  );
};

export default PartyComponent;
