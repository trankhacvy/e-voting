import { useConnection } from '@solana/wallet-adapter-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { web3, utils, BN } from '@project-serum/anchor'
import Modal from './Modal'
import useProgram from 'hooks/useProgram'
import useProvider from 'hooks/useProvider'
import { USDC_DEV } from 'common/Token'
import { ButtonSpinner } from './Spinner'
import { Candidate } from 'types/common'
import { wait } from 'utils/wait'
import { useCandidatesContext } from 'context/candidateContext'

export interface VoteModalProps {
  isOpen?: boolean
  onClose: () => void
  candidate: Candidate
}
const VoteModal: React.FC<VoteModalProps> = ({
  isOpen,
  onClose,
  candidate,
}) => {
  const [loading, setLoading] = useState(false)
  const [amout, setAmount] = useState('')
  const program = useProgram()
  const provider = useProvider()
  const { loadCandidates } = useCandidatesContext()

  const handleSubmit = async () => {
    try {
      let amountNumber
      try {
        amountNumber = parseFloat(amout)
      } catch (error) {
        amountNumber = 0
      }
      setLoading(true)

      const [treasurerPublicKey] = await web3.PublicKey.findProgramAddress(
        [Buffer.from('treasurer'), candidate.publicKey.toBuffer()],
        program.programId,
      )

      const candidateTokenAccount = await utils.token.associatedAddress({
        mint: USDC_DEV,
        owner: treasurerPublicKey,
      })

      const [ballotPublicKey] = await web3.PublicKey.findProgramAddress(
        [
          Buffer.from('ballot'),
          candidate.publicKey.toBuffer(),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId,
      )

      const walletTokenAccount = await utils.token.associatedAddress({
        mint: USDC_DEV,
        owner: provider.wallet.publicKey,
      })

      await program.rpc.vote(new BN(amountNumber), {
        accounts: {
          authority: provider.wallet.publicKey,
          candidate: candidate.publicKey,
          treasurer: treasurerPublicKey,
          mint: USDC_DEV,
          candidateTokenAccount,
          ballot: ballotPublicKey,
          voterTokenAccount: walletTokenAccount,
          tokenProgram: utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [],
      })
      toast.success('Thank you for voting')
      onClose()
      await wait(1000)
      loadCandidates()
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Title
        as="h3"
        className="text-lg font-semibold leading-6 text-white"
      >
        Vote for {candidate.name}
      </Modal.Title>
      <div className="mt-6">
        <input
          value={amout}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Amount"
          className="input"
          type="number"
          disabled={loading}
        />
      </div>

      <div className="flex justify-end mt-8 space-x-2">
        <button
          type="button"
          className="btn-secondary px-4 py-2 min-w-[8rem]"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn-primary text-center px-4 py-2 min-w-[8rem]"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ButtonSpinner className="inline-block h-4" />
          ) : (
            <span>Submit</span>
          )}
        </button>
      </div>
    </Modal>
  )
}

export default VoteModal
