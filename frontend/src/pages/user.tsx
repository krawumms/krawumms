import * as React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

import Layout from '../components/Layout';
import fetcher from '../util/fetcher';

type Props = {
  display_name: string;
  email: string;
  pathname: string;
};

const UserPage: NextPage<Props> = ({ display_name, email, pathname }) => (
  <Layout title="User Display from MongoDB | Krawumms">
    <h1>Hello {display_name}!</h1>
    <p>This is your mail address: {email}</p>
    <p>You are currently on: {pathname}</p>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

UserPage.getInitialProps = async ({ pathname }) => {
  const dataProfile = await fetcher('http://localhost:6011/profile');
  const dataKrawumms = await fetcher(`http://localhost:6011/user/${dataProfile.id}`);
  const { display_name, email } = dataKrawumms;

  return { display_name, email, pathname };
};

export default UserPage;
