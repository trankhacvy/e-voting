import { useConnection } from '@solana/wallet-adapter-react'
import { BorshAccountsCoder, Idl } from '@project-serum/anchor'
import useProgram from 'hooks/useProgram'
import idl from 'config/idl.json'
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react'
import { Candidate } from 'types/common'

export interface CandidatesContextValues {
  candidates: Candidate[] | null
  loading: boolean
  loadCandidates: () => void
}

const CandidatesContext = createContext<CandidatesContextValues | undefined>(
  undefined,
)

interface CandidatesContextProviderProps {
  children: ReactNode
}

export const CandidatesContextProvider = ({
  children,
}: CandidatesContextProviderProps) => {
  const [candidates, setCandidates] = useState<Candidate[] | null>(null)
  const [loading, setLoading] = useState(false)
  const { connection } = useConnection()
  const program = useProgram()

  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true)
      const accounts = await connection.getParsedProgramAccounts(
        program.programId,
        {
          filters: [{ dataSize: 1128 }],
        },
      )
      const decoder = new BorshAccountsCoder(idl as Idl)
      const candidates = accounts.map((account) => ({
        publicKey: account.pubkey,
        ...decoder.decode<Omit<Candidate, 'publicKey'>>(
          'Candidate',
          account.account.data as Buffer,
        ),
      }))
      candidates.sort((item1, item2) =>
        item2.createdAt.sub(item1.createdAt).toNumber(),
      )
      setCandidates(candidates)
    } catch (error) {
      console.error(error)
      setCandidates([])
    } finally {
      setLoading(false)
    }
  }, [connection, setLoading, setCandidates])

  useEffect(() => {
    loadCandidates()
  }, [loadCandidates])

  return (
    <CandidatesContext.Provider
      value={{
        candidates,
        loading: loading || !candidates,
        loadCandidates,
      }}
    >
      {children}
    </CandidatesContext.Provider>
  )
}

export function useCandidatesContext() {
  const context = useContext(CandidatesContext)
  if (!context)
    throw new Error(
      'useCandidatesContext must be inside a CandidatesContextProvider with a value',
    )

  return context
}
