import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { extractCritical } from 'emotion-server';

type Props = {
  ids: Array<string>;
  css: string;
};

export default class MyDocument extends Document<Props> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  static getInitialProps({ renderPage }) {
    const page = renderPage();
    const styles = extractCritical(page.html);
    return { ...page, ...styles };
  }

  render() {
    const { ids, css } = this.props;
    return (
      // eslint-disable-next-line jsx-a11y/html-has-lang
      <html>
        <Head>
          <style data-emotion-css={ids.join(' ')} dangerouslySetInnerHTML={{ __html: css }} />
          <link
            href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Sans+Pro:wght@400;600&display=swap"
            rel="stylesheet"
          />
          <script src="https://sdk.scdn.co/spotify-player.js" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.onSpotifyWebPlaybackSDKReady = () => {
              window.Spotify = Spotify;
            }`,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
