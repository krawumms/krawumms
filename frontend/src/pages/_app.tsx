import * as React from 'react';
import NextApp from 'next/app';
import { CacheProvider } from '@emotion/core';
// Use only { cache } from 'emotion'. Don't use { css }.
import { cache } from 'emotion';
import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import { AppInitialProps } from 'next/dist/next-server/lib/utils';
import { AppContext } from 'next/dist/pages/_app';

export default class App extends NextApp {
  static async getInitialProps({ Component, ctx, }: AppContext): Promise<AppInitialProps> {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const { req } = ctx;
    // @ts-ignore
    const { accessToken } = req || window.__NEXT_DATA__.props;

    return {
      pageProps,
      // @ts-ignore
      accessToken,
    };
  };
  render() {
    const { Component, pageProps } = this.props;
    return (
      <CacheProvider value={cache}>
        <ThemeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    );
  }
}