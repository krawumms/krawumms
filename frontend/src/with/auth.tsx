import React, { Component } from 'react';
import queryString from 'querystring';
import * as http from 'http';
import { NextPage } from 'next';
import cookie from 'cookie';
import config from '../config';
import fetcher from '../util/fetcher';

export async function triggerAuthCodeGrant(res: http.ServerResponse | undefined, asPath: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const url = `${config.uiBaseUrl}/api/oauth/login?${queryString.stringify({ state: asPath })}`;

  if (res) {
    // server-side redirect
    res.writeHead(302, { Location: url });
    res.end();
  } else if (typeof window !== 'undefined') {
    // client-side redirect
    window.location.href = url;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await new Promise(() => {}); // wait infinite for redirect to happen
  } else {
    throw new Error('WHOOP WHOOOP. Should not happen #YOLO');
  }
}

export default (Page: NextPage<any>, triggerAuthCode = true) => {
  return class PageWithAuth extends Component<any> {
    static async getInitialProps(context: {
      route: string;
      pathname: string;
      asPath: string;
      req?: http.ClientRequest;
      res?: http.ServerResponse;
    }) {
      const { req, res } = context;

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
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

      const hasNoAccessToken = !accessToken || Object.keys(accessToken).length === 0;

      if (triggerAuthCode && hasNoAccessToken) {
        await triggerAuthCodeGrant(res, context.asPath);
        return {};
      }

      let user = null;

      if (!hasNoAccessToken) {
        user = await fetcher(`${config.apiBaseUrl}/me`, {
          headers: {
            Authorization: `${accessToken.token_type} ${accessToken.access_token}`,
          },
        });
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      return Page.getInitialProps ? Page.getInitialProps({ ...context, accessToken, user }) : { accessToken, user };
    }

    render() {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <Page {...this.props} />;
    }
  };
};
