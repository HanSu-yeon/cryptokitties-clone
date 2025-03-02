import { PlanetName } from '@/components/Planet';
import { createContext, ReactNode, useState } from 'react';

//context 인터페이스 설정
interface ISpaceContext {
  planet: PlanetName;
  showPlanet: (planet: PlanetName) => void;
  clearPlanet: () => void;
}

//context가 제공안됐을때 기본값?
export const SpaceContext = createContext<ISpaceContext>({
  planet: null,
  showPlanet: () => {},
  clearPlanet: () => {},
});

export const SpaceContextProvider = ({ children }: { children: ReactNode }) => {
  const [planet, setPlanet] = useState<PlanetName>(null);

  return (
    //여기 설정한 변수들을 다른 곳에서 사용할 수 있음
    <SpaceContext.Provider
      value={{
        planet,
        showPlanet: (planet: PlanetName) => setPlanet(planet),
        clearPlanet: () => setPlanet(null),
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
};
