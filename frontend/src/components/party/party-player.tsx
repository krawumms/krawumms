import React, { FunctionComponent, useCallback } from 'react';

import { MdPlayArrow, MdPause } from 'react-icons/md';
import { Box, Heading, Text, Image, IconButton } from '@chakra-ui/core';
import { Track } from '../../interfaces';

type Props = {
  track: Track;
};

const PartyPlayer: FunctionComponent<Props> = ({ track }) => {
  const { url } = track.album.images.find(({ height }) => height === 300) || {};

  const onPlay = useCallback((trackId) => {
    // TODO: play song
    console.log(trackId);
  }, []);

  const onPause = useCallback((trackId) => {
    // TODO: pause song
    console.log(trackId);
  }, []);

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
      <Heading fontSize="18px">Currently Playing:</Heading>

      <Image
        fallbackSrc="https://via.placeholder.com/64"
        src={ url }
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
          onClick={() => onPlay(track.id)}
          padding="8px"
          margin="8px"
        />
        <IconButton
          variantColor="blue"
          aria-label="Pause Track"
          size="lg"
          isRound
          icon={MdPause}
          onClick={() => onPause(track.id)}
          padding="8px"
          margin="8px"
        />
      </Box>
    </Box>
  );
};

export default PartyPlayer;
