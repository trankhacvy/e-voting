import React from 'react'
import { Candidate } from 'types/common'
import CandidateCard from './CandidateCard'

export interface CandidateListProps {
  candidates: Candidate[]
}

const CandidateList: React.FC<CandidateListProps> = ({ candidates }) => {
  return (
    <div className="grid auto-rows-[minmax(min-content, max-content)] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.publicKey.toBase58()}
          candidate={candidate}
        />
      ))}
    </div>
  )
}

export default CandidateList
