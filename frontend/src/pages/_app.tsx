import 'antd/dist/reset.css';
import type { AppProps } from 'next/app';
import { Provider } from "react-redux";
import { useEffect, useState } from 'react';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { avalancheFuji, polygonMumbai, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { store } from 'src/controller/store';
import { ConfigProvider, theme } from 'antd';
const { defaultAlgorithm, darkAlgorithm } = theme;

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
    new MetaMaskConnector({ chains })
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

      <div style={{ visibility: !mounted ? 'hidden' : 'visible', backgroundColor: "#302F2F", height: "100vh", overflowY: "auto"}}>
        <Provider store={store}>

          <ConfigProvider
            theme={{
              token: {
                borderRadius: 16,
                colorPrimary: "#3a2ad3"
              },
              algorithm: darkAlgorithm
            }}
          >
            <Component {...pageProps} />
          </ConfigProvider>
        </Provider>
      </div>
    </WagmiConfig>
  )
}
