import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';

import Layout from '../components/Layout';
import useSWR from 'swr';
import fetcher from '../util/fetcher';

type Props = {
};

const limit = 20;

const SearchPage: NextPage<Props> = () => {
  const [query, setQuery] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);

  const handleQueryChange = useCallback((value) => {
    setQuery(value);
    setOffset(0);
  }, [setQuery, setOffset]);


  const handleOffsetChange = useCallback(() => {
    setOffset(offset + limit)
  }, [offset, setOffset]);

  const { data, error } = useSWR(`http://localhost:6011/search?query=${query}&limit=${limit}&offset=${offset}`, fetcher);

  return (
    <Layout title="Search | Krawumms">
      <h1>Search tracks on Spotify</h1>
    </Layout>
  );
};

export default SearchPage;
