import {
  AnchorProvider,
  Wallet,
} from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

const useProvider = () => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  const provider = useMemo(
    () =>
      new AnchorProvider(
        connection,
        anchorWallet as Wallet,
        AnchorProvider.defaultOptions()
      ),
    [connection, anchorWallet]
  );

  return provider;
};

export default useProvider;
