import React, { FunctionComponent } from 'react';
import { Flex, Link, Text } from '@chakra-ui/core';
import NextLink from 'next/link';
import Logo from '../../icons/logo.svg';
import LogoText from '../../icons/logo-text.svg';

const Footer: FunctionComponent = () => (
  <Flex as="footer" padding="16px" display="flex" flexDirection="column" wrap="wrap" bg="green.700" color="white">
    <NextLink href="/">
      <Link display="flex" alignItems="center">
        <Logo className="footer__logo" />
        <LogoText className="footer__logo-text" />
      </Link>
    </NextLink>
    <Text>Copyright © 2020 Krawumms Inc. All rights reserved.</Text>
    <style jsx>
      {`
        :global(.footer__logo) {
          height: 48px;
          width: 48px;
          fill: #ffffff;
        }

        :global(.footer__logo-text) {
          height: 16px;
          margin-left: 16px;
          fill: #ffffff;
        }
      `}
    </style>
  </Flex>
);

export default Footer;
