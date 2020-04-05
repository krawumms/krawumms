import * as React from 'react';
import { useRouter } from 'next/router';
import { NextPage, NextPageContext } from 'next';
import useSWR from 'swr';

import { Party } from '../../interfaces';
import fetcher from '../../util/fetcher';

type Props = {
  initialData?: Party;
};

const PartyPage: NextPage<Props> = ({ initialData }) => {
  const { query } = useRouter();
  const { id } = query;
  const { data, error } = useSWR<Party>(`http://localhost:6011/parties/${id}`, fetcher, { initialData });

  return (
    <>
      {error && <div>failed to load</div>}
      {!data && <div>loading...</div>}
      {data && !error && <div>{data?.name}</div>}
    </>
  );
};

PartyPage.getInitialProps = async ({ query }: NextPageContext) => {
  const { id } = query;
  const data = await fetcher(`http://localhost:6011/parties/${id}`);
  return { initialData: data };
};

export default PartyPage;
