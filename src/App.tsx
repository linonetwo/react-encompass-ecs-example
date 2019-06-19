import React, { useState, useMemo } from 'react';
import * as THREE from 'three';
import { apply, Canvas, useRender } from 'react-three-fiber';
import styled from 'styled-components';
import MainLoop from 'mainloop.js';
import config from '../package.json';

import { initGameWorld } from './store/gameplay';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

function Plane({ position }) {
  return (
    <mesh receiveShadow={true}>
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
      <Plane position={[0, 0, -10]} />
    </>
  );
}

type GameState = object;
function useGame(): [GameState, MainLoop] {
  const [gameState, setGameState] = useState({});
  return [
    gameState,
    useMemo(() => {
      const world = initGameWorld();
      const TIMESTEP = 1000 / config.gameConfig.FPS;
      const gameLoop = MainLoop.setSimulationTimestep(TIMESTEP)
        .setUpdate(deltaT => {
          world.update(deltaT);
        })
        .setDraw(() => {
          setGameState({});
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
  const [gameState] = useGame();

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
        <Scene />
      </Canvas>
    </Container>
  );
}
