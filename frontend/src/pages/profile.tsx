import * as React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

import Layout from '../components/Layout';
import fetcher from '../util/fetcher';

type Props = {
  display_name: string;
  email: string;
  access_token: string;
  refresh_token: string;
  pathname: string;
};

const ProfilePage: NextPage<Props> = ({ display_name, email, access_token, refresh_token, pathname }) => (
  <Layout title="Profile | Krawumms">
    <h1>Hello {display_name}!</h1>
    <p>This is your mail address: {email}</p>
    <p>This is your access token: {access_token}</p>
    <p>This is your refresh token: {refresh_token}</p>
    <a href="http://localhost:6011/refresh_token">Refresh your access token</a>
    <h2>User from DB</h2>
    <a href="http://localhost:3000/user">Show User from DB</a>
    <p>You are currently on: {pathname}</p>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

ProfilePage.getInitialProps = async ({ pathname }) => {
  const data = await fetcher('http://localhost:6011/profile');
  const { display_name, email, access_token, refresh_token } = data;

  return { display_name, email, access_token, refresh_token, pathname };
};

export default ProfilePage;
