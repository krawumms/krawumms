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
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.process = {};
                window.process.env = ${JSON.stringify(process.env)};
              `,
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
