import * as React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';

import Layout from '../components/layout';
import fetcher from '../util/fetcher';
import withAuth from '../with/auth';
import config from '../config';

type Props = {
  display_name: string;
  email: string;
  access_token: string;
  refresh_token: string;
  pathname: string;
};

const ProfilePage: NextPage<Props> = ({ display_name, email, access_token, refresh_token, pathname }) => {
  const { data, error } = useSWR(`${config.apiBaseUrl}/user/me`, fetcher);

  console.log(data, error);

  return (
    <Layout title="Profile | Krawumms">
      <h1>Hello {display_name}!</h1>
      <p>This is your mail address: {email}</p>
      <p>This is your access token: {access_token}</p>
      <p>This is your refresh token: {refresh_token}</p>
      <a href="http://localhost:6001/refresh_token">Refresh your access token</a>
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
};

ProfilePage.getInitialProps = async ({ pathname }) => {
  const data = await fetcher(`${config.apiBaseUrl}/user/me`);
  const { display_name, email, access_token, refresh_token } = data;

  return { display_name, email, access_token, refresh_token, pathname };
};

export default withAuth(ProfilePage);
