import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { MdPlayArrow, MdPause } from 'react-icons/md';
import Script from 'react-load-script';
import { Box, Heading, Text, Image, IconButton, Stack } from '@chakra-ui/core';
import { Track } from '../../interfaces';
import { AuthContext } from '../../contexts/AuthContext';
import SpotifyWebPlayer from '../../util/spotify-web-player';

type PlaylistTrack = {
  id: string;
  votes: Array<string>;
};

type Props = {
  tracks: Track[];
  playlist: PlaylistTrack[] | undefined;
};

const PartyPlayer: FunctionComponent<Props> = ({ tracks, playlist }) => {
  const { accessToken } = useContext(AuthContext);
  const [webPlayer, setWebPlayer] = useState<SpotifyWebPlayer>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [activeTrack, setActiveTrack] = useState<Track>();

  // album cover url of first song in tracks
  const { url } = activeTrack?.album.images.find(({ height }) => height === 300) || {};

  const handlePlayback = () => {
    if (isPlaying) {
      setIsPaused(!isPaused);
      return webPlayer?.player.togglePlay();
    }
    setIsPlaying(true);
    setIsPaused(false);
    return activeTrack ? webPlayer?.play(activeTrack) : null;
  };

  const handleScriptLoad = () => {
    return new Promise((resolve) => {
      if (window.Spotify) {
        resolve();
      } else {
        window.onSpotifyWebPlaybackSDKReady = resolve;
      }
    });
  };

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const player = new SpotifyWebPlayer(accessToken.access_token || '');
      setWebPlayer(player);
    };
  }, [accessToken]);

  useEffect(() => {
    setActiveTrack(tracks.shift());
  }, [tracks, setActiveTrack]);

  return (
    <Box>
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
        <Script url="https://sdk.scdn.co/spotify-player.js" onLoad={handleScriptLoad} />
        <Heading fontSize="18px">Currently Playing:</Heading>

        <Image
          fallbackSrc="https://via.placeholder.com/64"
          src={url}
          alt={`Album cover: ${activeTrack?.album}`}
          margin="16px auto"
        />
        <Text fontWeight="700">{activeTrack?.name}</Text>
        <Text>{activeTrack?.artists.map((artist) => artist.name).join(', ')}</Text>
        <Box>
          <IconButton
            variantColor="blue"
            aria-label="Pause Track"
            size="lg"
            isRound
            icon={isPaused ? MdPlayArrow : MdPause}
            onClick={() => handlePlayback()}
            padding="8px"
            margin="8px"
          />
        </Box>
      </Box>
      <Text borderBottom="solid 1px black">&nbsp;</Text>
      <Text fontSize="2xl" textAlign="center" margin="24px auto">
        Playlist:
      </Text>
      <Stack backgroundColor="#EDF2F7" maxHeight="500px" overflowY="auto" padding="8px">
        {tracks.map(({ name: trackName, id: trackId, artists, album: { images } }) => {
          const albumCoverUrl = images.find(({ height }) => height === 64)?.url || '';
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
                src={albumCoverUrl}
                alt={`Album cover: ${trackName}`}
                marginRight="16px"
              />
              <Box flex="1">
                <Heading as="h2" size="md">
                  {trackName}
                </Heading>
                <Text>{artists.map((artist) => artist.name).join(', ')}</Text>
                {playlistTrack && <Text> Votes: {playlistTrack.votes.length} </Text>}
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default PartyPlayer;
