import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import queryString from 'querystring';

import Layout from '../components/Layout';
import fetcher from '../util/fetcher';
import { Box, Button, Heading, Icon, Image, Input, Spinner, Stack, Text } from '@chakra-ui/core';
import { Track } from '../interfaces';
import config from '../config';

type Props = {};

const limit = 20;

const SearchPage: NextPage<Props> = () => {
  const [query, setQuery] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleQueryChange = useCallback(async (event) => {
    const newQuery = event.target.value;
    setIsLoading(true);
    setQuery(newQuery);
    const params = queryString.stringify({
      offset,
      query: newQuery,
      limit,
    });

    const newTracks = await fetcher(`${config.apiBaseUrl}/search?${params}`);
    setTracks(newTracks);
    setIsLoading(false);
  }, [setQuery, setTracks, setIsLoading]);

  const handleOffsetChange = useCallback(async () => {
    const newOffset = offset + limit;
    const params = queryString.stringify({
      offset: newOffset,
      query,
      limit,
    });
    const newTracks = await fetcher(`${config.apiBaseUrl}/search?${params}`);
    setTracks([...tracks, ...newTracks]);
    setOffset(newOffset);
  }, [offset, setOffset, tracks, query]);

  return (
    <Layout title="Search | Krawumms">
      <Box
        padding="16px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading as="h1">
          Search tracks on Spotify
        </Heading>
        <Box
          padding="32px"
          width={[
            '100%',
            '75%',
            '50%',
          ]}
        >
          <Input
            variant="filled"
            onChange={handleQueryChange}
            placeholder="Search"
          />
        </Box>
        {!isLoading && Array.isArray(tracks) && Boolean(tracks.length) && (
          <Stack
            width={[
              '100%',
              '75%',
              '50%',
            ]}
            backgroundColor="#EDF2F7"
            maxHeight="500px"
            overflowY="auto"
            padding="8px"
          >
            {tracks.map(({ name, id, artists, album: { images } }) => {
              const { url } = images.find(({ height }) => height === 64) || {};
              return (
                <Box
                  key={id}
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
                    alt={`Album cover: ${name}`}
                    marginRight="16px"
                  />
                  <Box>
                    <Heading
                      as="h2"
                      size="md"
                    >
                      {name}
                    </Heading>
                    <Text>
                      {artists.map((artist) => artist.name).join(', ')}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
        {!isLoading && query && !Boolean(tracks?.length) && (
          <Box
            padding="16px"
            display="flex"
            flex="1"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Icon
              name="info-outline"
              size="32px"
              margin="16px"
            />
            <Text
              textAlign="center"
            >
              No Results found
            </Text>
          </Box>
        )}
        {isLoading && (
          <Box
            flex="1"
            padding="32px"
          >
            <Spinner
              height="128px"
              width="128px"
            />
          </Box>
        )}
        {!isLoading && query && Boolean(tracks?.length) && (
          <Button
            margin="16px auto"
            onClick={handleOffsetChange}
            leftIcon="search"
          >
            Search more
          </Button>
        )}
      </Box>
    </Layout>
  );
};

export default SearchPage;
