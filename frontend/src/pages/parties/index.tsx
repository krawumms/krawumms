import * as React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

import Layout from '../../components/Layout';
import PartyList from '../../components/PartyList';
import { Party } from '../../interfaces';

type Props = {
  items: Party[];
  pathname: string;
};

const WithInitialProps: NextPage<Props> = ({ items, pathname }) => (
  <Layout title="Party List | Krawumms">
    <h1>Party List</h1>
    <p>
      Example fetching data from inside <code>getInitialProps()</code>.
    </p>
    <p>You are currently on: {pathname}</p>
    <PartyList items={items} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

WithInitialProps.getInitialProps = async ({ pathname }) => {
  const response: Response = await fetch('http://localhost:6011/parties');

  const items = await response.json();

  return { items, pathname };
};

export default WithInitialProps;
