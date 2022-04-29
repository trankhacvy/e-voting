import { web3, BN } from '@project-serum/anchor'

export interface Candidate {
    publicKey: web3.PublicKey
    name: string
    description: string
    startDate: BN
    endDate: BN
    createdAt: BN
    amount: BN
    mint: web3.PublicKey
}