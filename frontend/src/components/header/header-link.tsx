import React, { FunctionComponent, ReactNode } from 'react';
import { Link } from '@chakra-ui/core';
import NextLink from 'next/link';

type Props = {
  href: string;
  children: ReactNode;
};

const HeaderLink: FunctionComponent<Props> = ({ href, children }) => (
  <NextLink href={href}>
    <Link
      height="100%"
      width="100%"
      fontSize="18px"
      fontWeight="600"
      display="flex"
      alignItems="center"
      padding={{ base: '16px', md: '4px 24px' }}
      border={{ base: 'none', md: '1px solid #ffffff' }}
      borderRadius={{ base: '0px', md: '4px' }}
      _hover={{ textDecoration: 'none', background: '#1f523a' }}
    >
      {children}
    </Link>
  </NextLink>
);

export default HeaderLink;
