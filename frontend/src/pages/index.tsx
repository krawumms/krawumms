import * as React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Landing from '../components/landing/landing';

const IndexPage: NextPage = () => {
  return (
    <div className="landing-page">
      <Head>
        <title>Krawumms</title>
      </Head>
      <Landing />
    </div>
  );
};

export default IndexPage;
