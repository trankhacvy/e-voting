import dayjs from 'dayjs'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import { web3, utils, BN } from '@project-serum/anchor'
import Modal from './Modal'
import useProgram from 'hooks/useProgram'
import useProvider from 'hooks/useProvider'
import { USDC_DEV } from 'common/Token'
import { ButtonSpinner } from './Spinner'
import { wait } from 'utils/wait'
import { useCandidatesContext } from 'context/candidateContext'

export interface NewCandidateModalProps {
  isOpen?: boolean
  onClose: () => void
}
const NewCandidateModal: React.FC<NewCandidateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(
    dayjs().add(1, 'd').toDate(),
  )
  const program = useProgram()
  const provider = useProvider()
  const { loadCandidates } = useCandidatesContext()

  const handleSubmit = async () => {
    try {
      if (!name || !description || !startDate || !endDate) return

      setLoading(true)
      const candidate = new web3.Keypair()
      const [treasurerPublicKey] = await web3.PublicKey.findProgramAddress(
        [Buffer.from('treasurer'), candidate.publicKey.toBuffer()],
        program.programId,
      )
      const candidateTokenAccount = await utils.token.associatedAddress({
        mint: USDC_DEV,
        owner: treasurerPublicKey,
      })
      const startTime = new BN(dayjs(startDate).startOf('d').unix())
      const endTime = new BN(dayjs(endDate).endOf('d').unix())

      await program.rpc.initializeCandidate(
        name,
        description,
        startTime,
        endTime,
        {
          accounts: {
            authority: provider.wallet.publicKey,
            candidate: candidate.publicKey,
            treasurer: treasurerPublicKey,
            mint: USDC_DEV,
            candidateTokenAccount,
            tokenProgram: utils.token.TOKEN_PROGRAM_ID,
            associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
            systemProgram: web3.SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
          },
          signers: [candidate],
        },
      )
      toast.success('The candidate has been created successfully')
      handleClose()
      await wait(1000)
      loadCandidates()
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setStartDate(new Date())
    setEndDate(dayjs().add(1, 'd').toDate())
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Modal.Title
        as="h3"
        className="text-lg font-semibold leading-6 text-white"
      >
        New candidate
      </Modal.Title>
      <div className="mt-6">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          className="input"
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
          rows={4}
          className="input mt-4"
        />
        <div className="flex mt-4 space-x-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="input"
            dateFormat="dd/MM/yyyy"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="input"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>

      <div className="flex justify-end mt-8 space-x-2">
        <button
          type="button"
          className="btn-secondary px-4 h-10 min-w-[8rem]"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn-primary text-center px-4 h-10 min-w-[8rem]"
          onClick={handleSubmit}
        >
          {loading ? (
            <ButtonSpinner className="inline-block" />
          ) : (
            <span>Submit</span>
          )}
        </button>
      </div>
    </Modal>
  )
}

export default NewCandidateModal
