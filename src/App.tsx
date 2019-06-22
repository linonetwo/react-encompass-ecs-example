import React, { useState, useEffect, useMemo, useRef, createRef } from 'react';
import * as THREE from 'three';
import { Canvas, useRender, applyProps } from 'react-three-fiber';
import { StatsGraph } from '@helpscout/stats';
import styled from 'styled-components';
import MainLoop from 'mainloop.js';
import { Provider as EntityProvider, IEntityMap, useComponent } from 'react-encompass-ecs';

import config from '../package.json';
import { initGameWorld } from './store/gameplay';
import { PositionComponent } from './store/gameplay/components/position';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

function useTransientData<T>(dataSource: T, mapDataSource: (source: T) => object) {
  const bind = useRef<any>();
  useRender(() => applyProps(bind.current, mapDataSource(dataSource)));
  return bind;
}

function useTransientDataList<T>(dataSources: T[], mapDataSource: (source: T) => object, amount: number = dataSources.length) {
  const refsRef = useRef<Array<React.MutableRefObject<any>>>([]);
  // update refs array only when "amount" changed
  refsRef.current = useMemo(() => {
    const elementRefs: Array<React.MutableRefObject<any>> = [];
    for (let count = 0; count < amount; count += 1) {
      elementRefs.push(createRef<any>());
    }
    return elementRefs;
  }, [amount]);
  useRender(() => {
    refsRef.current.forEach((ref, index) => {
      // after this ref attached to the element, and data is prepared
      if (ref.current && dataSources[index]) {
        const props = mapDataSource(dataSources[index]);
        applyProps(ref.current, props);
      }
    });
  }, false, [dataSources]);
  return refsRef.current;
}

function Planes() {
  const { boxes } = useComponent({ boxes: [PositionComponent] });
  const refs = useTransientDataList(boxes, ([{ x, y }]) => ({ position: [x, y, 0] }));
  return (
    <>
      {refs.map((_, index) => (
        <mesh ref={refs[index]} receiveShadow={true} key={index}>
          <planeBufferGeometry attach="geometry" args={[20, 20]} />
          <meshPhongMaterial attach="material" color="#272727" />
        </mesh>
      ))}
    </>
  );
}

function Scene() {
  // Hook into the render loop and rotate the scene a bit
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.6} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow={true} />
      <Planes />
    </>
  );
}

type GameState = IEntityMap;
export function useGame(): [GameState, MainLoop] {
  const [currentGameEntities, setGameEntities] = useState({});
  return [
    currentGameEntities,
    useMemo(() => {
      const { world, entityStore } = initGameWorld();
      const TIMESTEP = 1000 / config.gameConfig.UPS;
      const gameLoop = MainLoop.setSimulationTimestep(TIMESTEP)
        .setMaxAllowedFPS(config.gameConfig.FPS)
        .setUpdate(deltaT => {
          world.update(deltaT);
        })
        .setDraw(() => {
          world.draw();
          // only actually update when entity changed, component change won't trigger setState, because this is a reference
          setGameEntities(entityStore.entities);
        })
        .setEnd((fps, panic) => {
          if (panic) {
            gameLoop.resetFrameDelta();
          }
        });
      gameLoop.start();
      return gameLoop;
    }, []),
  ];
}

export default function App() {
  const [currentGameEntities] = useGame();
  return (
    <Container>
      <Canvas
        style={{ background: '#324444' }}
        camera={{ position: [0, 0, 15], rotation: [(15 * Math.PI) / 180, 0, 0] }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <EntityProvider entities={currentGameEntities}>
          <Scene />
        </EntityProvider>
      </Canvas>
      <StatsGraph />
    </Container>
  );
}
