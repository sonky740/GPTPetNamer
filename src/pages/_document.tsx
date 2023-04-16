import { Html, Head, Main, NextScript } from 'next/document';
import StyledComponent from '@/resources/styles/StyledComponents';

export default function Document() {
  return (
    <Html lang="ko">
      <Head />
      <body>
        <StyledComponent>
          <Main />
          <NextScript />
        </StyledComponent>
      </body>
    </Html>
  );
}
