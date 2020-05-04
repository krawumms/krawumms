import * as React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Menu, MenuButton, MenuList, MenuItem, MenuGroup, Button, Box, IconButton } from '@chakra-ui/core';

type Props = {
  title?: string;
};

const Layout: React.FunctionComponent<Props> = ({ children, title = 'This is the default title' }) => (
  <html lang="en">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Box bg="#1bd363" w="100%" color="white" left="0" top="0" text-align="center">
      <header>
        <Menu closeOnSelect>
          <MenuButton as={Button} bg="none" _hover={{ bg: 'none' }} _focus={{ shadow: 'none' }}>
            <IconButton
              aria-label="Menu"
              icon="triangle-down"
              bg="none"
              _hover={{ bg: 'none' }}
              _focus={{ shadow: 'none' }}
            />
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
            </MenuGroup>
          </MenuList>
        </Menu>
      </header>
    </Box>
    <Box p="1em" pb="3em">
      {children}
    </Box>
    <footer>
      <Box bg="#1bd363" w="100%" p={4} color="white" position="fixed" left="0" bottom="0" text-align="center">
        <p>Created with love</p>
      </Box>
    </footer>
  </html>
);

export default Layout;
