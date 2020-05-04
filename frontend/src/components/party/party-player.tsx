import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { MdPlayArrow, MdPause } from 'react-icons/md';
import Script from 'react-load-script';
import { Box, Heading, Text, Image, IconButton } from '@chakra-ui/core';
import { Track } from '../../interfaces';
import { AuthContext } from '../../contexts/AuthContext';
import SpotifyWebPlayer from '../../util/spotify-web-player';

type Props = {
  track: Track;
};

const PartyPlayer: FunctionComponent<Props> = ({ track }) => {
  const { url } = track.album.images.find(({ height }) => height === 300) || {};

  const { accessToken } = useContext(AuthContext);
  const [webPlayer, setWebPlayer] = useState<SpotifyWebPlayer>();

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
      console.log('Player Ready :D');
      console.log('Accesstoken: ', accessToken);
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const player = new SpotifyWebPlayer(accessToken.access_token || '');
      setWebPlayer(player);
    };
  }, [accessToken]);

  return (
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
        alt={`Album cover: ${track.album}`}
        margin="16px auto"
      />
      <Text fontWeight="700">{track.name}</Text>
      <Text>{track.artists.map((artist) => artist.name).join(', ')}</Text>
      <Box>
        <IconButton
          variantColor="blue"
          aria-label="Play Track"
          size="lg"
          isRound
          icon={MdPlayArrow}
          onClick={() => webPlayer?.play(track)}
          padding="8px"
          margin="8px"
        />
        <IconButton
          variantColor="blue"
          aria-label="Pause Track"
          size="lg"
          isRound
          icon={MdPause}
          onClick={() => webPlayer?.player.togglePlay()}
          padding="8px"
          margin="8px"
        />
      </Box>
    </Box>
  );
};

export default PartyPlayer;
