import * as React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

import Layout from '../../components/Layout';
import List from '../../components/List';
import { Todo } from '../../interfaces';

type Props = {
  items: Todo[];
  pathname: string;
};

const WithInitialProps: NextPage<Props> = ({ items, pathname }) => (
  <Layout title="Todo List | Krawumms">
    <h1>Todo List</h1>
    <p>
      Example fetching data from inside <code>getInitialProps()</code>.
    </p>
    <p>You are currently on: {pathname}</p>
    <List items={items} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

WithInitialProps.getInitialProps = async ({ pathname }) => {
  const response: Response = await fetch('http://localhost:6011/todos');

  const items = await response.json();

  return { items, pathname };
};

export default WithInitialProps;
