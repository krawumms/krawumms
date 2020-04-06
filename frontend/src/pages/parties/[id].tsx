import React from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import useSWR from 'swr';

import { Party } from '../../interfaces';
import fetcher from '../../util/fetcher';
import { Spinner } from '@chakra-ui/core/dist';
import config from '../../config';
import Layout from '../../components/Layout';
import PartyComponent from '../../components/party/party';

type Props = {
};

const PartyPage: NextPage<Props> = () => {
  const { query: { id }  } = useRouter();

  const { data, error } = useSWR<Party>(`${config.apiBaseUrl}/parties/${id}`, fetcher);

  const name = (data && data.name) || '';

  return (
    <Layout title={`Party ${name} | Krawumms`}>
      {!data && !error && (
        <Spinner size="xl" />
      )}
      {data && (
        <PartyComponent
          party={data}
        />
      )}
    </Layout>
  );
};

export default PartyPage;
