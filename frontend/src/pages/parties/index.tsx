import React from 'react';
import { NextPage } from 'next';

import Layout from '../../components/layout';
import Parties from '../../components/party/parties';
import withAuth from '../../with/auth';

type Props = {};

const PartiesPage: NextPage<Props> = () => {
  return (
    <Layout title="Party List | Krawumms">
      <Parties />
    </Layout>
  );
};

export default withAuth(PartiesPage);
