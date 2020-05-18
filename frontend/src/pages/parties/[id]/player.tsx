import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { Box, Heading } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import useFetch from 'use-http/dist';
import Layout from '../../../components/layout';
import PartyPlayer from '../../../components/party/party-player';
import { Track } from '../../../interfaces';
import withAuth from '../../../with/auth';

type PlaylistTrack = {
  id: string;
  votes: Array<string>;
};

const PlayerPage: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  const [songs, setSongs] = useState<PlaylistTrack[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);

  const { get, response } = useFetch(`/parties/${id}/playlist`);

  const { get: getSongs, response: responseSongs } = useFetch('/tracks');

  const loadPlaylist = useCallback(async () => {
    const songsToStore = await get();
    if (response.ok) setSongs(songsToStore);
  }, [get, response]);

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

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
        <Heading margin="16px">Krawumms Player</Heading>
        {Array.isArray(tracks) && Boolean(tracks.length) && <PartyPlayer tracks={tracks} playlist={songs} />}
      </Box>
    </Layout>
  );
};

export default withAuth(PlayerPage);
