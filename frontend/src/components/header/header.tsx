import React, { useCallback, useState } from 'react';
import { Box, Flex, Link } from '@chakra-ui/core';
import NextLink from 'next/link';

import Logo from '../../icons/logo.svg';
import LogoText from '../../icons/logo-text.svg';
import HeaderItem from './header-item';
import HeaderLink from './header-link';

const Header = () => {
  const [show, setShow] = useState(false);
  const handleToggle = useCallback(() => setShow(!show), [setShow, show]);

  return (
    <Flex as="nav" display="flex" align="center" justify="space-between" wrap="wrap" bg="green.700" color="white">
      <Flex
        padding="16px"
        justify="space-between"
        width={{ base: 'full', md: 'auto' }}
        align="center"
        marginRight={{ base: '0px', md: '16px' }}
        borderBottom={{ base: '1px solid #ffffff', md: 'none' }}
      >
        <NextLink href="/">
          <Link display="flex" alignItems="center">
            <Logo className="header__logo" />
            <LogoText className="header__logo-text" />
          </Link>
        </NextLink>
        <Box display={{ sm: 'block', md: 'none' }} onClick={handleToggle}>
          <svg fill="white" width="32px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </Box>
      </Flex>

      {show && (
        <Box
          display={{ sm: show ? 'block' : 'none', md: 'flex' }}
          width={{ sm: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
        >
          <HeaderItem>
            <HeaderLink href="/parties">Parties</HeaderLink>
          </HeaderItem>
        </Box>
      )}
      <style jsx>
        {`
          :global(.header__logo) {
            height: 64px;
            width: 64px;
            fill: #ffffff;
          }

          :global(.header__logo-text) {
            height: 24px;
            margin-left: 16px;
            fill: #ffffff;
          }
        `}
      </style>
    </Flex>
  );
};

export default Header;
