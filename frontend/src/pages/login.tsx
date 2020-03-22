import * as React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const LoginPage: React.FunctionComponent = () => (
  <Layout title="Login | Krawumms">
    <h1>Login</h1>
    <p>This is the login page</p>
    <p>
      <a href="http://localhost:6011/login">Log in with Spotify</a>
    </p>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export default LoginPage;
