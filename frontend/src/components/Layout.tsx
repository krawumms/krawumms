import * as React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Menu, MenuButton, MenuList, MenuItem, MenuGroup, Button, Box, Icon, Image } from '@chakra-ui/core';

type Props = {
  title?: string;
};

const Layout: React.FunctionComponent<Props> = ({ children, title = 'This is the default title' }) => (
  <Box>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Box bg="#1bd363" w="100%" color="white" left="0" top="0" text-align="center">
      <Menu closeOnSelect>
        <MenuButton as={Button} bg="none" _hover={{ bg: 'none' }} _focus={{ shadow: 'none' }}>
          <Icon name="triangle-down" aria-label="Menu" bg="none" />
        </MenuButton>
        <MenuList bg="#1bd363">
          <MenuGroup>
            <Link href="/">
              <MenuItem _hover={{ color: 'black' }} _focus={{ bg: 'none' }}>
                Home
              </MenuItem>
            </Link>
            <Link href="/parties">
              <MenuItem _hover={{ color: 'black' }} _focus={{ bg: 'none' }}>
                Party List
              </MenuItem>
            </Link>
            <Link href="/player">
              <MenuItem _hover={{ color: 'black' }} _focus={{ bg: 'none' }}>
                Party Player
              </MenuItem>
            </Link>
          </MenuGroup>
        </MenuList>
      </Menu>
    </Box>
    <Box p="1em" pb="3em" bg="none">
      {children}
    </Box>
    <Box
      bg="#1bd363"
      h="4em"
      w="100%"
      p={4}
      color="white"
      position="fixed"
      left="0"
      bottom="0"
      text-align="center"
      padding="0.5em"
    >
      <Image src="/footer-logo.png" h="3em" margin="auto" />
    </Box>
  </Box>
);

export default Layout;
