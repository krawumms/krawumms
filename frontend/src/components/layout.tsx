import * as React from 'react';
import Head from 'next/head';
import { Box, Flex } from '@chakra-ui/core';
import Header from './header/header';
import Footer from './footer/footer';

type Props = {
  title?: string;
};

const Layout: React.FunctionComponent<Props> = ({ children, title = 'This is the default title' }) => (
  <Flex flexDirection="column" minHeight="100vh" minWidth="100vw">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header />
    <Box flex="1">{children}</Box>
    <Footer />
  </Flex>
);

export default Layout;
