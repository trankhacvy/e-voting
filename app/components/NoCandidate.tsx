import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import React from 'react'

export interface NoCandidateProps {
  onCreateOne: () => void
}

const NoCandidate: React.FC<NoCandidateProps> = ({ onCreateOne }) => {
  const { connected } = useWallet()
  return (
    <div className="text-center my-20">
      <p className="text-2xl text-slate-400 font-medium">No candidate found</p>
      {connected ? (
        <button onClick={onCreateOne} className="btn-primary px-4 py-2 mt-4">
          Create one
        </button>
      ) : (
        <WalletMultiButton className="btn-primary inline-flex mt-4" />
      )}
    </div>
  )
}

export default NoCandidate
