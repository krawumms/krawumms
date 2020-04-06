import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { extractCritical } from 'emotion-server';

type Props = {
  ids: Array<string>,
  css: string,
}

export default class MyDocument extends Document<Props> {
  // @ts-ignore
  static getInitialProps({ renderPage} ) {
    const page = renderPage();
    const styles = extractCritical(page.html);
    return { ...page, ...styles };
  }

  render() {
    const { ids, css } = this.props;
    return (
      <html>
      <Head>
        <style
          data-emotion-css={ids.join(' ')}
          dangerouslySetInnerHTML={{ __html: css }}
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
