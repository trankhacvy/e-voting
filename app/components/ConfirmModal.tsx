import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { web3, utils } from '@project-serum/anchor'
import Modal from './Modal'
import useProgram from 'hooks/useProgram'
import useProvider from 'hooks/useProvider'
import { USDC_DEV } from 'common/Token'
import { ButtonSpinner } from './Spinner'
import { Candidate } from 'types/common'
import { wait } from 'utils/wait'
import { useCandidatesContext } from 'context/candidateContext'

export interface ConfirmModalProps {
  isOpen?: boolean
  onClose: () => void
  candidate: Candidate
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  candidate,
}) => {
  const [loading, setLoading] = useState(false)
  const program = useProgram()
  const provider = useProvider()
  const { loadCandidates } = useCandidatesContext()

  const handleSubmit = async () => {
    try {
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

      await program.rpc.close({
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

      toast.success('Successfully closed')
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
        Close vote
      </Modal.Title>
      <div className="mt-6">
        <p className="text-lg font-medium">
          Are you sure you want to close this vote?
        </p>
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
            <span>OK</span>
          )}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmModal
