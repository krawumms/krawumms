import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import useSWR from 'swr';

import { Spinner } from '@chakra-ui/core/dist';
import { Party } from '../../interfaces';
import fetcher from '../../util/fetcher';
import config from '../../config';
import Layout from '../../components/Layout';
import PartyComponent from '../../components/party/party';
import { PartyContext } from '../../contexts/PartyContext';

type Props = {};

const PartyPage: NextPage<Props> = () => {
  const {
    query: { id },
  } = useRouter();

  const { setCurrentPartyId } = useContext(PartyContext);
  useEffect(() => {
    if (typeof id === 'string') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      setCurrentPartyId(id);
    }
  }, [setCurrentPartyId, id]);

  const { data, error } = useSWR<Party>(`${config.apiBaseUrl}/parties/${id}`, fetcher);

  const name = (data && data.name) || '';

  return (
    <Layout title={`Party ${name} | Krawumms`}>
      {!data && !error && <Spinner size="xl" />}
      {data && <PartyComponent party={data} />}
    </Layout>
  );
};

export default PartyPage;
