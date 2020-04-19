import * as React from 'react';
import NextApp from 'next/app';
import { CacheProvider } from '@emotion/core';
// Use only { cache } from 'emotion'. Don't use { css }.
import { cache } from 'emotion';
import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import { AppInitialProps } from 'next/dist/next-server/lib/utils';
import { AppContext } from 'next/dist/pages/_app';
import queryString from 'querystring';
import cookie from 'cookie';

import { AuthProvider } from '../contexts/AuthContext';

type Props = {
  accessToken: any;
};

export default class App extends NextApp<Props> {
  static async getInitialProps({ Component, ctx }: AppContext): Promise<AppInitialProps> {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const { req } = ctx;
    const cookies = cookie.parse(req?.headers.cookie || '');
    const token = queryString.parse(cookies.krawummsToken as string);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    let accessToken = token;

    if (!req) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      accessToken = window?.__NEXT_DATA__?.props?.accessToken;
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      req.accessToken = accessToken;
    }

    return {
      pageProps,
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      accessToken,
    };
  }

  render() {
    const { Component, pageProps, accessToken } = this.props;
    return (
      <CacheProvider value={cache}>
        <ThemeProvider>
          <CSSReset />
          <AuthProvider value={{ accessToken }}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </AuthProvider>
        </ThemeProvider>
      </CacheProvider>
    );
  }
}
