import React, { useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';
import styled from 'styled-components';
import MainLoop from 'mainloop.js';
import { World } from 'encompass-ecs';
import config from '../package.json';

import { Provider as EntityProvider, IEntityMap, useComponent } from './react-encompass-ecs';
import { initGameWorld } from './store/gameplay';
import { PositionComponent } from './store/gameplay/components/position';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

function Plane() {
  const { box: [position] = [{ x: 0, y: 0 }] } = useComponent({ box: [PositionComponent] });
  return (
    <mesh receiveShadow={true} position={[position.x, position.y, 0]}>
      <planeBufferGeometry attach="geometry" args={[20, 20]} />
      <meshPhongMaterial attach="material" color="#272727" />
    </mesh>
  );
}

function Scene() {
  // Hook into the render loop and rotate the scene a bit
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.6} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow={true} />
      <Plane />
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
    </Container>
  );
}
