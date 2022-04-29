import {
  web3,
  utils,
  BN,
  Spl,
  AnchorProvider,
  Program,
  workspace,
  setProvider,
} from '@project-serum/anchor'
import { EvotingSystem } from '../target/types/evoting_system'
import { initializeAccount, initializeMint } from './utils'
import { expect } from 'chai'

describe('evoting-system', () => {
  const provider = AnchorProvider.local();
  setProvider(provider);
  const mainProgram = workspace.EvotingSystem as Program<EvotingSystem>;
  const splProgram = Spl.token();

  const candidate = new web3.Keypair();
  let treasurer: web3.PublicKey;
  const mint = new web3.Keypair();
  let candidateTokenAccount: web3.PublicKey;

  let walletTokenAccount: web3.PublicKey;
  let ballot: web3.PublicKey;

  before(async () => {
    // Init a mint
    await initializeMint(9, mint, provider)
    // Derive treasurer account
    const [treasurerPublicKey] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('treasurer'), candidate.publicKey.toBuffer()],
      mainProgram.programId,
    )
    treasurer = treasurerPublicKey
    const [ballotPublicKey] = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from('ballot'),
        candidate.publicKey.toBuffer(),
        provider.wallet.publicKey.toBuffer(),
      ],
      mainProgram.programId,
    )
    ballot = ballotPublicKey

    // Derive token account
    walletTokenAccount = await utils.token.associatedAddress({
      mint: mint.publicKey,
      owner: provider.wallet.publicKey,
    })
    candidateTokenAccount = await utils.token.associatedAddress({
      mint: mint.publicKey,
      owner: treasurerPublicKey,
    })

    // Create Token account + Mint to token
    await initializeAccount(
      walletTokenAccount,
      mint.publicKey,
      provider.wallet.publicKey,
      provider,
    )
    await splProgram.rpc.mintTo(new BN(1_000_000_000_000), {
      accounts: {
        mint: mint.publicKey,
        to: walletTokenAccount,
        authority: provider.wallet.publicKey,
      },
    })
  })

  it('initialize candidate', async () => {
    const now = Math.floor(new Date().getTime() / 1000)
    const startTime = new BN(now)
    const endTime = new BN(now + 5)

    await mainProgram.rpc.initializeCandidate(startTime, endTime, {
      accounts: {
        authority: provider.wallet.publicKey,
        candidate: candidate.publicKey,
        treasurer,
        mint: mint.publicKey,
        candidateTokenAccount,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      },
      signers: [candidate],
    })

    const candidateData = await mainProgram.account.candidate.fetch(candidate.publicKey);

    expect(BN.isBN(candidateData.amount), "amount is a BN").eq(true);
    expect(new BN(candidateData.amount).toNumber(), "amount is 0").eq(0);
    expect(candidateData.startDate.toNumber()).eq(startTime.toNumber());
    expect(candidateData.endDate.toNumber()).eq(endTime.toNumber());
    expect(candidateData.mint.toString()).eq(mint.publicKey.toString());

  })

  it('vote', async () => {
    await mainProgram.rpc.vote(new BN(1), {
      accounts: {
        authority: provider.wallet.publicKey,
        candidate: candidate.publicKey,
        treasurer,
        mint: mint.publicKey,
        candidateTokenAccount,
        ballot,
        voterTokenAccount: walletTokenAccount,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      },
      signers: [],
    })
  })

  it('close', async () => {
    setTimeout(async () => {
      await mainProgram.rpc.close({
        accounts: {
          authority: provider.wallet.publicKey,
          candidate: candidate.publicKey,
          treasurer,
          mint: mint.publicKey,
          candidateTokenAccount,
          ballot,
          voterTokenAccount: walletTokenAccount,
          tokenProgram: utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [],
      })
    }, 5000)
  })


})
