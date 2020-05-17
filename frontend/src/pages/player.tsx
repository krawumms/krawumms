import React, { useContext } from 'react';
import { NextPage } from 'next';
import { Box, Heading } from '@chakra-ui/core';
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
        display="flex"
        width="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        backgroundColor="#FFFFFF"
        marginBottom="24px"
      >
        <Heading marginBottom="16px">Krawumms Player</Heading>
        {Array.isArray(tracks) && Boolean(tracks.length) && <PartyPlayer tracks={tracks} playlist={playlist} />}
      </Box>
    </Layout>
  );
};

export default withAuth(PlayerPage);
