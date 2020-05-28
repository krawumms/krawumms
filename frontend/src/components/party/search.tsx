import React, { FunctionComponent, useCallback, useState } from 'react';
import useFetch from 'use-http';
import queryString from 'querystring';
import Autosuggest from 'react-autosuggest';
import { Box, Heading, Image, Text } from '@chakra-ui/core';
import { Track } from '../../interfaces';

type Props = {
  onAddClick: (trackId: string) => void;
};

const limit = 5;

const SearchPage: FunctionComponent<Props> = ({ onAddClick }) => {
  const [query, setQuery] = useState<string>('');
  const [tracks, setTracks] = useState<Track[]>([]);

  const { response: searchResponse, get: search } = useFetch(`/search`);

  const handleQueryChange = useCallback(
    async ({ value }) => {
      setQuery(value);
      const params = queryString.stringify({
        offset: 0,
        query: value,
        limit,
      });
      const tracksFound = await search(`?${params}`);
      if (searchResponse.ok) setTracks(tracksFound);
    },
    [search, searchResponse],
  );

  const getTrackValue = useCallback((track: Track) => track.id, []);

  const renderTrack = useCallback(({ name, artists, album: { images } }: Track) => {
    const { url } = images.find(({ height }) => height === 64) || {};
    return (
      <Box
        backgroundColor="#ffffff"
        padding="16px"
        boxShadow="lg"
        display="flex"
        borderRadius="2px"
        alignItems="center"
      >
        <Image fallbackSrc="https://via.placeholder.com/64" src={url} alt={`Album cover: ${name}`} marginRight="16px" />
        <Box>
          <Heading as="h2" size="md">
            {name}
          </Heading>
          <Text>{artists.map((artist) => artist.name).join(', ')}</Text>
        </Box>
      </Box>
    );
  }, []);

  const handleChange = useCallback(
    (event, { newValue }) => {
      if (event.type === 'click') {
        onAddClick(newValue);
        setQuery('');
      } else {
        setQuery(newValue);
      }
    },
    [setQuery, onAddClick],
  );

  const handleClear = useCallback(() => {
    setTracks([]);
  }, [setTracks]);

  const inputProps = {
    placeholder: 'Type a song name or artist',
    value: query,
    onChange: handleChange,
  };

  return (
    <Box
      padding="16px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width={['100%', '75%', '50%']}
    >
      <Heading as="h1">Search tracks on Spotify</Heading>
      <Autosuggest
        suggestions={tracks}
        onSuggestionsFetchRequested={handleQueryChange}
        onSuggestionsClearRequested={handleClear}
        getSuggestionValue={getTrackValue}
        renderSuggestion={renderTrack}
        inputProps={inputProps}
      />
      <style jsx global>
        {`
          .react-autosuggest__container {
            position: relative;
            width: 100%;
            margin: 32px 0;
          }

          .react-autosuggest__input {
            width: 100%;
            height: 30px;
            padding: 10px 20px;
            font-weight: 400;
            font-size: 16px;
            border: 1px solid #aaa;
            border-radius: 3px;
            padding: 24px 12px;
            background-color: #edf2f7;
          }

          .react-autosuggest__input--focused {
            outline: none;
          }

          .react-autosuggest__input--open {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }

          .react-autosuggest__suggestions-container {
            display: none;
          }

          .react-autosuggest__suggestions-container--open {
            display: block;
            position: absolute;
            top: 51px;
            width: 100%;
            border: 1px solid #aaa;
            background-color: #fff;
            font-family: Helvetica, sans-serif;
            font-weight: 300;
            font-size: 16px;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            z-index: 2;
          }

          .react-autosuggest__suggestions-list {
            margin: 0;
            padding: 0;
            list-style-type: none;
          }

          .react-autosuggest__suggestion {
            cursor: pointer;
          }

          .react-autosuggest__suggestion--highlighted {
            background-color: #ddd;
          }
        `}
      </style>
    </Box>
  );
};

export default SearchPage;
