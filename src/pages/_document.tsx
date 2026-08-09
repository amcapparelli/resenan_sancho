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
          {/*
            Preload the self-hosted fonts used above the fold (body 400/600 +
            heading 600) so first paint isn't blocked on their discovery. The
            @font-face rules themselves live in src/styles/fonts.css. crossOrigin
            is required even same-origin: fonts fetch in CORS mode, and omitting
            it makes the browser double-fetch. rambla-400 and fraunces-italic-400
            are intentionally NOT preloaded — they're secondary and would compete
            with the LCP image.
          */}
          <link rel="preload" href="/fonts/source-sans-3-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          <link rel="preload" href="/fonts/source-sans-3-600.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          <link rel="preload" href="/fonts/fraunces-600.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
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
