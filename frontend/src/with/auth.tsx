import React, { Component } from 'react';
import queryString from 'querystring';
import * as http from 'http';
import { NextPage } from 'next';

const basePath = 'http://localhost:3000/oauth/login';

export async function triggerAuthCodeGrant(
  res: http.ServerResponse | undefined,
  asPath: string,
) {
  // @ts-ignore
  const url = `${basePath}?${queryString.stringify({ state: asPath })}`;

  if (res) {
    // server-side redirect
    res.writeHead(302, { Location: url });
    res.end();
  } else if (typeof window !== 'undefined') {
    // client-side redirect
    window.location.href = url;
    await new Promise(() => {
    }); // wait infinite for redirect to happen
  } else {
    throw new Error('WHOOP WHOOOP. Should not happen #YOLO');
  }
}


let initialAt: string;
if (typeof window !== 'undefined') {
  // @ts-ignore
  initialAt = window.__NEXT_DATA__ && window.__NEXT_DATA__.props && window.__NEXT_DATA__.props.accessToken;
}

export default (Page: NextPage<any>) => {
  return class PageWithAuth extends Component<any> {
    static async getInitialProps(context: {
      route: string,
      pathname: string,
      asPath: string,
      req?: http.ClientRequest & { accessToken: string | null, refreshToken: string | null },
      res?: http.ServerResponse,
    }) {
      const { req, res } = context;

      const accessToken = (req && req.accessToken) || initialAt;

      if (!accessToken) {
        await triggerAuthCodeGrant(res, context.asPath);
        return {};
      }

      // @ts-ignore
      return Page.getInitialProps ? Page.getInitialProps({ ...context, accessToken }) : {};
    }

    render() {
      return (
        <Page {...this.props} />
      );
    }
  };
};
