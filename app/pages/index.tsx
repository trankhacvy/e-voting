import type { NextPage } from 'next'
import React, { useState } from 'react'
import Head from 'next/head'
import NoCandidate from 'components/NoCandidate'
import NewCandidateModal from 'components/NewCandidateModal'
import { Spinner } from 'components/Spinner'
import CandidateList from 'components/CandidateList'
import { useCandidatesContext } from 'context/candidateContext'

const Home: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { candidates, loading } = useCandidatesContext()
  return (
    <>
      <Head>
        <title>Moon</title>
        <meta name="description" content="Moon" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="container mx-auto px-6 min-h-[calc(100vh-64px-106px)]">
        <div className="py-10">
          <h3 className="text-white text-6xl font-bold text-center">
            Vote for your favorite candidates
          </h3>
          <p className="text-center text-2xl mt-2">Your vote Your voice</p>
          {loading && (
            <div className="text-center my-10">
              <Spinner className="inline" />
            </div>
          )}
          {!loading && !!candidates && candidates.length === 0 && (
            <NoCandidate onCreateOne={() => setIsOpen(true)} />
          )}
          {!loading && !!candidates && candidates.length > 0 && (
            <CandidateList candidates={candidates!} />
          )}
        </div>
        <NewCandidateModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </main>
    </>
  )
}

export default Home
