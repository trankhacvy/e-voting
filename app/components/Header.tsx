import React, { useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import NewCandidateModal from './NewCandidateModal'
import { useWallet } from '@solana/wallet-adapter-react'

export interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { connected } = useWallet()

  return (
    <header className="sticky top-0 z-30 h-16 backdrop-filter backdrop-blur-xl">
      <div className="flex items-center justify-between container mx-auto px-6 py-3 h-full">
        <a className="inline-flex items-center h-full" href="/">
          <img src="logo.png" alt="Logo" className="h-10" />
          <span className="text-white font-bold text-xl ml-2">Moon</span>
        </a>
        <div className="flex items-center space-x-4">
          {connected && (
            <button
              onClick={() => setIsOpen(true)}
              className="btn-primary px-6 h-12"
            >
              New Candidate
            </button>
          )}
          <WalletMultiButton className="btn-primary inline-flex" />
        </div>
      </div>
      <NewCandidateModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  )
}

export default Header
