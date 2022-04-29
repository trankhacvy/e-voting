import { web3 } from '@project-serum/anchor'

// export const USDC_DEV = new web3.PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');
export const USDC_DEV = new web3.PublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT as string);