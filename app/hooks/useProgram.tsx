import { Program } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import idl from '../config/idl.json'
import { useMemo } from 'react'
import useProvider from './useProvider'
import type { EvotingSystem } from '../../target/types/evoting_system'

const PROGRAM_KEY = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID as string)

const useProgram = () => {
  const provider = useProvider()

  const program = useMemo(
    () => new Program<EvotingSystem>(idl as any, PROGRAM_KEY, provider),
    [provider],
  )

  return program
}

export default useProgram
