import { Title } from '@/components';
import { usePlanetContract } from '@/components/hooks';
import { MenuView } from '@/components/MenuView/MenuView';
import { PlanetList } from '@/components/Planet';
import { Web3Context } from '@/contexts';
import { SpaceContext } from '@/contexts/useSpace';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import BN from 'bn.js';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

import Web3 from 'web3';

const BASE_URL = 'http://127.0.0.1:8545';

const Mint: NextPage = () => {
  const router = useRouter();
  const { showPlanet, clearPlanet } = useContext(SpaceContext);
  const [planetIndex, setPlanetIndex] = useState(-1);

  const { web3 } = useContext(Web3Context);
  const { mintPlanet } = usePlanetContract(web3);
  ll;
  const showRandomPlanet = () => {
    setPlanetIndex(Math.floor(Math.random() * PlanetList.length));
  };

  useEffect(() => {
    if (planetIndex >= 0) {
      showPlanet(PlanetList[planetIndex]);
    }
    return () => clearPlanet();
  }, [planetIndex, showPlanet, clearPlanet]);

  useEffect(() => {
    // console.log(web3);
    const interval = setInterval(() => showRandomPlanet(), 1000);

    showRandomPlanet();

    return () => clearInterval(interval);
  }, []);

  const mint = async () => {
    if (!web3) {
      console.log('!web');

      return;
    }
    const accounts = await web3.eth.requestAccounts();
    const currentAccount = accounts[0];
    console.log(currentAccount);

    mintPlanet({
      from: currentAccount,
      value: web3.utils.toWei(new BN(10).toString(), 'milliether'),
    }).on('transactionHash', (txHash: string) => {
      router.push(`/mint/${txHash}`);
    });
  };

  return (
    <MainView>
      <MenuView>
        <Title>CRYPTOSPACE</Title>
        <Description>
          You can mint a planet NFT by paying <b>0.01ETH</b>.
          <br />
          You will get a random planet.
          <br />
          Please press below button to mint!
        </Description>
        <ButtonView>
          <MenuButton variant="contained" size="large" onClick={() => mint()}>
            Mint Planet
          </MenuButton>
          <MenuButton variant="contained" size="large" onClick={() => router.back()}>
            Go Prev
          </MenuButton>
        </ButtonView>
      </MenuView>
    </MainView>
  );
};

const MainView = styled.div`
  margin-top: 100px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Description = styled.div`
  font-size: 16px;
  line-height: 24px;
  font-weight: 100;
  color: #ffffff;
  text-align: center;
`;

const ButtonView = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;
const MenuButton = styled(Button)`
  margin: 4px 0;
`;

export default Mint;
