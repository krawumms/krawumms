import React, { FunctionComponent, ReactNode } from 'react';
import { Flex } from '@chakra-ui/core';

type Props = {
  children: ReactNode;
};

const HeaderItem: FunctionComponent<Props> = ({ children }) => (
  <Flex mr={{ base: '0px', md: '8px' }} align="center" borderBottom={{ base: '1px solid #ffffff', md: 'none' }}>
    {children}
  </Flex>
);

export default HeaderItem;
