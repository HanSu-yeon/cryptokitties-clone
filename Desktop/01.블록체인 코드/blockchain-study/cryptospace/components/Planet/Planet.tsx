import { useGLTF } from '@react-three/drei';
import { PrimitiveProps, useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';

export type PlanetName = 'sun' | 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | null;

export const PlanetList = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'] as PlanetName[];

interface PlanetProps extends Partial<PrimitiveProps> {
  name: PlanetName;
}
export const Planet = ({ name, ...primitiveProps }: PlanetProps) => {
  l;
  const planetRef = useRef<any>();
  const { scene: sun } = useGLTF('/api/proxy/3d-objects/sun.glb');
  const { scene: mercury } = useGLTF('/api/proxy/3d-objects/mercury.glb');
  const { scene: venus } = useGLTF('/api/proxy/3d-objects/venus.glb');
  const { scene: earth } = useGLTF('/api/proxy/3d-objects/earth.glb');
  const { scene: mars } = useGLTF('/api/proxy/3d-objects/mars.glb');

  const scene = useMemo(
    () =>
      name
        ? {
            sun,
            mercury,
            venus,
            earth,
            mars,
          }[name]
        : null,
    [sun, mercury, venus, earth, mars, name]
  );

  const copiedScene = useMemo(() => (scene ? scene.clone() : null), [scene]);

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.x = 3;
      planetRef.current.rotation.y += 0.008;
    }
  });

  return copiedScene !== null ? (
    <group key="planet" dispose={null}>
      <primitive ref={planetRef} object={copiedScene.children[copiedScene.children.length - 1]} {...primitiveProps} />
    </group>
  ) : null;
};
