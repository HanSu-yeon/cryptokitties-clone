import React, { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';

declare const ethereum: any;

// const BASE_URL = 'http://127.0.0.1:8545';

interface IWeb3Context {
  web3: Web3 | null;
  walletRequired: boolean;
}

export const Web3Context = createContext<IWeb3Context>({
  web3: null,
  walletRequired: false,
});

export const Web3ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [walletRequired, setWalletRequired] = useState<boolean>(false);

  useEffect(() => {
    // if (typeof window !== 'undefined' && typeof ethereum !== 'undefined') {
    if (typeof ethereum !== 'undefined') {
      // ethereum.requets({ method: 'eth_requestAccounts' });
      setWeb3(new Web3(ethereum));
      setWalletRequired(false);
    } else {
      console.log('metamask not installed');
      setWalletRequired(true);
    }
  }, []);
  return <Web3Context.Provider value={{ web3, walletRequired }}>{children}</Web3Context.Provider>;
};
