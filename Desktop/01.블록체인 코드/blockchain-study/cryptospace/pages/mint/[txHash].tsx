import { Metadata, Title } from '@/components';
import { usePlanetContract } from '@/components/hooks';
import { MenuView } from '@/components/MenuView/MenuView';
import { Web3Context } from '@/contexts';
import { SpaceContext } from '@/contexts/useSpace';
import styled from '@emotion/styled';
import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';

type TxStatus = 'PENDING' | 'MINING' | 'MINED' | 'WRONG_TX';

const MintTx = () => {
  const router = useRouter();
  const { txHash } = router.query;

  const [status, setStatus] = useState<TxStatus>('PENDING');
  const { web3 } = useContext(Web3Context);

  const { contractAddress, tokenURI } = usePlanetContract(web3);

  const { showPlanet } = useContext(SpaceContext);
  const [metadata, setMetadata] = useState();
  const [owner, setOwner] = useState('');
  const [tokenId, setTokenId] = useState<number | null>(null);
  const checkTx = useCallback(async () => {
    if (web3 && txHash) {
      //receipt:마이닝되면 나오는 값
      const receipt = await web3.eth.getTransactionReceipt(txHash as string);

      if (receipt) {
        console.log(receipt);
        const mintingEvent = receipt.logs.filter(log => log.topics[0] === web3.utils.sha3('Transfer(address,address,uint256)'))[0];
        // console.log('Filtered Minting Events:', mintingEvent);
        const isMintingTx = receipt.to.toLowerCase() === contractAddress.toLowerCase() && mintingEvent;

        if (isMintingTx) {
          // console.log('isMintingTx', isMintingTx);
          const tokenId = mintingEvent.topics[3];
          const uri = await tokenURI(tokenId);
          const metadataQuery = await fetch(uri);
          const metadata = await metadataQuery.json();
          // console.log(metadata);
          setMetadata(metadata);
          const owner = mintingEvent.topics[2];
          setOwner(owner.slice(-40));
          setTokenId(web3.utils.hexToNumber(tokenId));
          const planetType = metadata.planetType as PlanetName;
          showPlanet(planetType);
          setStatus('MINED');
        }
      } else {
        setStatus('MINING');
      }
    }
  }, [web3, txHash, contractAddress, showPlanet, tokenURI]);
  useEffect(() => {
    if (status === 'PENDING') {
      checkTx();
      return;
    }

    if (status === 'MINING') {
      const interval = setInterval(() => checkTx(), 5000);
      return () => clearInterval(interval);
    }
  }, [status, checkTx]);

  return (
    <TxView>
      <DownMenuView>
        {status === 'MINING' && (
          <>
            <Progress />
            <Description>Wait until transaction is mined...</Description>
          </>
        )}
        {status === 'WRONG_TX' && (
          <>
            <Title>Wrong Transaction</Title>
            <Description>It{"'"}s not a mining Transaction.</Description>
          </>
        )}
        {status === 'MINED' && (
          <>
            <Title>Planet #{tokenId}</Title>
            <Metadata owner={owner} properties={metadata.attributes} />
          </>
        )}
        {status !== 'PENDING' && status !== 'MINING' && (
          <GoPrevButton variant="contained" size="large" onClick={() => router.back()}>
            Go prev
          </GoPrevButton>
        )}
      </DownMenuView>
    </TxView>
  );
};

const TxView = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DownMenuView = styled(MenuView)`
  margin-top: 320px;
  align-items: center;
`;

const Description = styled.div`
  width: 100%;
  margin-top: 8px;
  color: #ccc;
  text-align: center;
`;

const Progress = styled(CircularProgress)`
  margin-top: 24px;
  margin-bottom: 24px;
`;

const GoPrevButton = styled(Button)`
  margin-top: 24px;
  width: 100%;
`;

export default MintTx;
