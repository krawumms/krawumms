import React from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/core';

import Layout from '../../components/Layout';
import fetcher from '../../util/fetcher';
import config from '../../config';
import Parties from '../../components/party/parties';
import withAuth from '../../with/auth';

type Props = {};

const PartiesPage: NextPage<Props> = () => {
  const { data, error } = useSWR(`${config.apiBaseUrl}/parties`, fetcher);

  return (
    <Layout title="Party List | Krawumms">
      {!data && !error && <Spinner size="xl" />}
      {data && <Parties parties={data} />}
    </Layout>
  );
};

export default withAuth(PartiesPage);
