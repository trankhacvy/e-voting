import dayjs from 'dayjs'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Candidate } from 'types/common'
import ConfirmModal from './ConfirmModal'
import VoteModal from './VoteModal'

export interface CandidateCardProps {
  candidate: Candidate
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const { name, description, amount, startDate, endDate } = candidate
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenConfirm, setIsOpenConfirm] = useState(false)
  const isInactiveCandidate = endDate.toNumber() * 1000 < new Date().getTime()
  return (
    <div
      className={`rounded-md p-5 bg-gray-300 shadow-lg inline-block ${
        isInactiveCandidate ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl text-white font-medium">{name}</h2>
        <span className="rounded-full px-4 py-1 bg-blue-500 text-white font-semibold">
          {amount.toNumber()}
        </span>
      </div>
      <p className="text-slate-400 text-sm mt-1">
        {dayjs(startDate.toNumber() * 1000).format('DD/MM/YYYY')} -{' '}
        {dayjs(endDate.toNumber() * 1000).format('DD/MM/YYYY')}
      </p>
      <p className="text-xl mt-2 h-[140px] line-clamp-5">{description}</p>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          className="btn-secondary px-6 py-1.5"
          onClick={() => setIsOpenConfirm(true)}
        >
          Close
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary px-6 py-1.5"
          disabled={isInactiveCandidate}
        >
          Vote
        </button>
      </div>
      <VoteModal
        candidate={candidate}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <ConfirmModal
        candidate={candidate}
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
      />
    </div>
  )
}

export default CandidateCard
