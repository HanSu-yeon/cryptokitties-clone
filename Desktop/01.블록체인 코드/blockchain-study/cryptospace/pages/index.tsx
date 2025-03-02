// export default function Home() {
//   return <div></div>;
// }

import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';
import { MenuView, Title } from '@/components';

import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <MainView>
      <MenuView>
        <Title>CRYPTOSPACE</Title>
        <Link href="/mint" passHref legacyBehavior>
          <MenuButton component="a" variant="outlined" size="large">
            Minting Your Own Planet
          </MenuButton>
        </Link>
        <Link href="/list" passHref legacyBehavior>
          <MenuButton component="a" variant="outlined" size="large">
            View All
          </MenuButton>
        </Link>
      </MenuView>
    </MainView>
  );
};

const MainView = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuButton = styled(Button)`
  margin: 4px 0;
`;
export default Home;
