import React, { useContext } from 'react';
import { NextPage } from 'next';
import { Box, Heading, Image, Stack, Text } from '@chakra-ui/core';
import useSWR from 'swr';
import { PartyContext } from '../contexts/PartyContext';
import config from '../config';
import fetcher from '../util/fetcher';
import Layout from '../components/Layout';
import PartyPlayer from '../components/party/party-player';
import { Track } from '../interfaces';
import withAuth from '../with/auth';

type PlaylistTrack = {
  id: string;
  votes: Array<string>;
};

const PlayerPage: NextPage = () => {
  const { partyId } = useContext(PartyContext);

  const { data: playlist } = useSWR<PlaylistTrack[]>(`${config.apiBaseUrl}/parties/${partyId}/playlist`, fetcher, {
    refreshInterval: 1000,
  });

  if (playlist && playlist.length) {
    playlist.sort((a, b) => b.votes.length - a.votes.length);
  }
  const trackIds = playlist && playlist.map((track) => track.id);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { data: tracks } = useSWR<Track[]>(() => `${config.apiBaseUrl}/tracks?ids=${trackIds.toString()}`, fetcher);

  return (
    <Layout title="Player | Krawumms">
      <Box
        padding="16px"
        display="flex"
        width="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        backgroundColor="#EDF2F7"
        marginBottom="24px"
      >
        <Heading>Krawumms Player</Heading>
        {Array.isArray(tracks) && Boolean(tracks.length) && (
          <div>
            <PartyPlayer track={tracks[0]} />
            <Stack backgroundColor="#EDF2F7" maxHeight="500px" overflowY="auto" padding="8px">
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
                      {playlistTrack && <Text> Votes: {playlistTrack.votes.length} </Text>}
                      <Text>{artists.map((artist) => artist.name).join(', ')}</Text>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </div>
        )}
      </Box>
    </Layout>
  );
};

export default withAuth(PlayerPage);
