import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

import { Spinner } from '@chakra-ui/core/dist';
import useFetch from 'use-http/dist';
import { Party } from '../../../interfaces';
import withAuth from '../../../with/auth';
import Layout from '../../../components/layout';
import PartyComponent from '../../../components/party/party';

const PartyPage: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  const [party, setParty] = useState<Party | null>(null);
  const { get, response, loading, error } = useFetch(`/parties/${id}`);

  const loadParty = useCallback(async () => {
    const partyToStore = await get();
    if (response.ok) setParty(partyToStore);
  }, [get, response, setParty]);

  useEffect(() => {
    loadParty();
  }, [loadParty]);

  return (
    <Layout title="Party | Krawumms">
      {loading && !error && <Spinner size="xl" />}
      {party && <PartyComponent party={party} />}
    </Layout>
  );
};

export default withAuth(PartyPage, false);
