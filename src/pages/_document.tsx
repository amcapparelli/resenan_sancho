/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../utils/createEmotionCache';

interface MyDocumentInitialProps extends DocumentInitialProps {
  emotionStyleTags: JSX.Element[];
  // Active request locale, resolved from Next i18n so <Html lang> is accurate
  // (e.g. lang="en" under /en) instead of a hardcoded value.
  locale: string;
}

class MyDocument extends Document<MyDocumentInitialProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<MyDocumentInitialProps> {
    const styledComponentsSheet = new ServerStyleSheet();
    const emotionCache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(emotionCache);
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: (App: any) => function EnhanceApp(props) {
          return styledComponentsSheet.collectStyles(
            <App emotionCache={emotionCache} {...props} />,
          );
        },
      });

      const initialProps = await Document.getInitialProps(ctx);
      const emotionStyles = extractCriticalToChunks(initialProps.html);
      const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
          data-emotion={`${style.key} ${style.ids.join(' ')}`}
          key={style.key}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: style.css }}
        />
      ));

      return {
        ...initialProps,
        locale: ctx.locale ?? ctx.defaultLocale ?? 'es',
        emotionStyleTags,
        styles: (
          <>
            {initialProps.styles}
            {styledComponentsSheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      styledComponentsSheet.seal();
    }
  }

  render() {
    return (
      <Html lang={this.props.locale} dir="ltr">
        <Head>
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
