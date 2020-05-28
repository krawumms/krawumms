import React, { FunctionComponent, useCallback, useContext, useEffect, useReducer } from 'react';

import { MdPause, MdPlayArrow } from 'react-icons/md';
import { Box, Flex, Heading, IconButton, Image, Stack, Text } from '@chakra-ui/core';
import fetcher from 'isomorphic-unfetch';
import { Track } from '../../interfaces';
import useSpotifyWebPlaybackSdk from '../../hooks/useSpotifyWebPlaybackSdk';
import { TokenContext } from '../../contexts/token';

type PlaylistTrack = {
  id: string;
  votes: Array<string>;
};

type Props = {
  tracks: Track[];
  playlist: PlaylistTrack[] | undefined;
};

type State = {
  activeTrack: Track | null;
  isPlaying: boolean;
  isInit: boolean;
  isLoading: boolean;
};

type Action =
  | { type: 'TOGGLE_PLAYING' }
  | { type: 'SET_ACTIVE_TRACK'; track: Track | null }
  | { type: 'SET_IS_LOADING'; isLoading: boolean }
  | { type: 'TOGGLE_INIT' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_PLAYING':
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };
    case 'SET_ACTIVE_TRACK':
      return {
        ...state,
        activeTrack: action.track,
      };
    case 'TOGGLE_INIT':
      return {
        ...state,
        isInit: !state.isInit,
      };
    case 'SET_IS_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };
    default:
      return state;
  }
}

const initialState = {
  isPlaying: false,
  isInit: true,
  activeTrack: null,
  isLoading: false,
};

let isChangingSong = false;

const PartyPlayer: FunctionComponent<Props> = ({ tracks, playlist }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { accessToken } = useContext(TokenContext);

  const { isPlaying, activeTrack, isLoading, isInit } = state;

  const { deviceId, player } = useSpotifyWebPlaybackSdk({
    name: 'Krawumms Web Player', // Device that shows up in the spotify devices list
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    getOAuthToken: () => accessToken, // Wherever you get your access token from
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    onPlayerStateChanged: (playerState: {
      track_window: {
        previous_tracks: Array<{
          id: string;
        }>;
        current_track: {
          id: string;
        };
      };
      paused: boolean;
    }) => {
      if (
        playerState &&
        playerState.track_window.previous_tracks.find((x) => x.id === playerState.track_window.current_track.id) &&
        isPlaying &&
        playerState.paused
      ) {
        if (!isChangingSong) {
          isChangingSong = true;
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          handleTrackChanged(tracks.shift() || null);
        }
      }
    },
  });

  const handleTrackChanged = useCallback(
    async (track: Track | null) => {
      dispatch({ type: 'SET_ACTIVE_TRACK', track });
      const body = {
        uris: [track?.uri],
      };
      await fetcher(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body),
      });
      isChangingSong = false;
    },
    [accessToken, deviceId],
  );

  const handlePause = useCallback(async () => {
    await fetcher(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }, [accessToken, deviceId]);

  const handleResume = useCallback(async () => {
    await fetcher(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }, [accessToken, deviceId]);

  const handleTogglePlayer = useCallback(async () => {
    dispatch({ type: 'TOGGLE_PLAYING' });
    if (isInit) {
      dispatch({ type: 'TOGGLE_INIT' });
      await handleTrackChanged(activeTrack);
    }
    if (isPlaying && player) {
      await handlePause();
    } else if (!isPlaying && player) {
      await handleResume();
    }
  }, [isInit, isPlaying, player, handleTrackChanged, activeTrack, handlePause, handleResume]);

  // album cover url of first song in tracks
  const { url } = activeTrack?.album.images.find(({ height }) => height === 300) || {};

  useEffect(() => {
    dispatch({ type: 'SET_ACTIVE_TRACK', track: tracks.shift() || null });
  }, [tracks]);

  return (
    <Flex width="100%" align="center" flexDirection="column">
      {!isLoading && activeTrack && (
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
          <Heading fontSize="18px" margin="16px">
            Currently Playing:
          </Heading>

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
              icon={!isPlaying ? MdPlayArrow : MdPause}
              onClick={handleTogglePlayer}
              padding="8px"
              margin="8px"
            />
          </Box>
        </Box>
      )}
      <Text fontSize="2xl" textAlign="center" margin="24px auto">
        Playlist:
      </Text>
      <Stack backgroundColor="#EDF2F7" maxHeight="500px" overflowY="auto" padding="8px" width={['100%', '75%', '65%']}>
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
              flexShrink={0}
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
    </Flex>
  );
};
export default PartyPlayer;
