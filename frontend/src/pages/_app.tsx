import * as React from 'react';
import { AppProps } from 'next/app';
import { CacheProvider } from '@emotion/core';
import { cache } from 'emotion';
import { v4 as uuid } from 'uuid';
import { CSSReset, theme, ThemeProvider } from '@chakra-ui/core';
import { CachePolicies, CustomOptions, Provider } from 'use-http';
import { AppInitialProps } from 'next/dist/next-server/lib/utils';
import { AppContext } from 'next/dist/pages/_app';
import queryString from 'querystring';
import cookie from 'cookie';
import config from '../config';
import { ClientUuidProvider } from '../contexts/client-uuid';
import { TokenProvider } from '../contexts/token';

const krawummsTheme = {
  ...theme,
  fonts: {
    body: 'Source Sans Pro, sans-serif',
    heading: 'Bebas Neue, cursive',
    mono: 'Menlo, monospace',
  },
};

const App = ({ Component, pageProps, clientUuid }: AppProps & { clientUuid: string }) => {
  const { accessToken, ...actualPageProps } = pageProps;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const fetchOptions: CustomOptions = {
    cachePolicy: CachePolicies.NO_CACHE,
    interceptors: {
      // every time we make an http request, this will run 1st before the request is made
      // url, path and route are supplied to the interceptor
      // request options can be modified and must be returned
      request: async ({ options }) => {
        if (!options.headers) {
          // eslint-disable-next-line no-param-reassign
          options.headers = {
            Authorization: `Bearer ${accessToken.access_token}`,
            'x-krawumms-client': clientUuid,
          };
        } else {
          // eslint-disable-next-line no-param-reassign
          options.headers = {
            Authorization: `Bearer ${accessToken.access_token}`,
            'x-krawumms-client': clientUuid,
            ...options.headers,
          };
        }
        // eslint-disable-next-line no-param-reassign
        return options;
      },
    },
  };

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={krawummsTheme}>
        <TokenProvider value={{ accessToken: accessToken && accessToken.access_token }}>
          <ClientUuidProvider value={{ clientUuid }}>
            <CSSReset />
            <Provider url={config.apiBaseUrl} options={fetchOptions}>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Component {...actualPageProps} />
            </Provider>
          </ClientUuidProvider>
        </TokenProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

App.getInitialProps = async ({ Component, ctx }: AppContext): Promise<AppInitialProps> => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const { req, res } = ctx;
  const cookies = cookie.parse(req?.headers.cookie || '');
  const token = queryString.parse(cookies.krawummsToken as string);
  const client = cookies.krawummsClientUuid;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  let accessToken = token;
  let clientUuid = client;

  if (!req) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    accessToken = window?.__NEXT_DATA__?.props?.accessToken;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    clientUuid = window?.__NEXT_DATA__?.props?.clientUuid;
  } else {
    if (!clientUuid) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      clientUuid = uuid();
    }
    const now = new Date();
    now.setDate(now.getDate() + 30);
    if (res) {
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('krawummsClientUuid', clientUuid, {
          path: '/',
          expires: now,
        }),
      );
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    req.accessToken = accessToken;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    req.clientUuid = clientUuid;
  }

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    accessToken,
    clientUuid,
    pageProps: {
      ...pageProps,
      clientUuid,
    },
  };
};

export default App;
