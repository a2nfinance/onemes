import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <title>OneMes</title>
                <meta name="title" content="One Mes" />
                <meta name="description" content="Instant Token Transfers with Just One Message: Simplifying Crypto Transactions, Anywhere, Anytime!" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                {/* <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
                /> */}
                <meta property="og:url" content="https://app.onemes.a2n.finance/"></meta>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}