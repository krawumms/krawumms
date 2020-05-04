import React, { useContext } from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/core';

import Layout from '../../components/Layout';
import fetcher from '../../util/fetcher';
import config from '../../config';
import Parties from '../../components/party/parties';
import withAuth from '../../with/auth';
import { AuthContext } from '../../contexts/AuthContext';

type Props = {};

const PartiesPage: NextPage<Props> = () => {
  const { accessToken } = useContext(AuthContext);
  const { data, error } = useSWR(`${config.apiBaseUrl}/parties`, (url) =>
    fetcher(url, { headers: { Authorization: `${accessToken.token_type} ${accessToken.access_token}` } }),
  );

  return (
    <Layout title="Party List | Krawumms">
      {!data && !error && <Spinner size="xl" />}
      {data && <Parties parties={data} />}
    </Layout>
  );
};

export default withAuth(PartiesPage);
