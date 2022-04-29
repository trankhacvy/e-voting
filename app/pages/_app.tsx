import '@solana/wallet-adapter-react-ui/styles.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { clusterApiUrl } from '@solana/web3.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import {
  WalletProvider,
  ConnectionProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import Header from 'components/Header'
import Footer from 'components/Footer'
import { CandidatesContextProvider } from 'context/candidateContext'

dayjs.extend(relativeTime)

const wallets = [new PhantomWalletAdapter()]

const getEndpoint = () => {
  const networkEnv = process.env.NEXT_PUBLIC_NETWORK_ENV
  if (networkEnv === 'devnet') {
    return clusterApiUrl(WalletAdapterNetwork.Devnet)
  } else if (networkEnv === 'testnet') {
    return clusterApiUrl(WalletAdapterNetwork.Testnet)
  } else if (networkEnv === 'mainnet') {
    return clusterApiUrl(WalletAdapterNetwork.Mainnet)
  } else {
    return 'http://localhost:8899'
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConnectionProvider endpoint={getEndpoint()}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <CandidatesContextProvider>
            <Header />
            <Component {...pageProps} />
            <Footer />
            <ToastContainer
              hideProgressBar
              theme="dark"
              position="bottom-right"
            />
          </CandidatesContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default MyApp
