import 'antd/dist/reset.css';
import type { AppProps } from 'next/app';
import Router from "next/router";
import NProgress from "nprogress";
import {Provider} from "react-redux";
import { useEffect, useState } from 'react';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { avalancheFuji, polygonMumbai, sepolia } from 'wagmi/chains'
// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { store } from 'src/controller/store';

// Router.events.on("routeChangeStart", (url) => {
//   NProgress.start()
// })

// Router.events.on("routeChangeComplete", (url) => {
//   NProgress.done()
// })

// Router.events.on("routeChangeError", (url) => {
//   NProgress.done()
// })

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [avalancheFuji, polygonMumbai, sepolia],
  [
    publicProvider()
  ]
)

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: 'wagmi',
    //   },
    // }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     projectId: '...',
    //   },
    // }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: 'Injected',
    //     shimDisconnect: true,
    //   },
    // }),
  ],
  publicClient,
  webSocketPublicClient,
})

export default function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (typeof window !== 'undefined') {
    window.onload = () => {
      document.getElementById('holderStyle')!.remove();
    };
  }

  return (
    <WagmiConfig config={config}>
      <style
        id="holderStyle"
        dangerouslySetInnerHTML={{
          __html: `
                    *, *::before, *::after {
                        transition: none!important;
                    }
                    `,
        }}
      />

      <div style={{ visibility: !mounted ? 'hidden' : 'visible' }}>
      <Provider store={store}>
        <Component {...pageProps} />
</Provider>
      </div>
    </WagmiConfig>
  )
}
