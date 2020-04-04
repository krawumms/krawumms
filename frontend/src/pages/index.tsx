import * as React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';

import Layout from '../components/Layout';

const IndexPage: NextPage = () => {
  return (
    <Layout title="Home | Krawumms">
      <h1>Hello from Krawumms</h1>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
      <p>
        <Link href="/login">
          <a>Login</a>
        </Link>
      </p>
      <p>
        <Link href="/parties">
          <a>Parties</a>
        </Link>
      </p>
    </Layout>
  );
};

export default IndexPage;
