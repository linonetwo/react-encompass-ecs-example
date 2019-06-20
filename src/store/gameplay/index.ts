import { WorldBuilder } from 'encompass-ecs';
import { TileComponent } from './components/tile';
import { TileMapSpawner } from './spawner/tileMap';
import { BoxSpawner } from './spawner/box';
import { MapInstantizationMessage } from './messages/tileMap';
import { MotionEngine } from './engines/motion';
import { VelocityEngine } from './engines/velocity';

import { EntitySyncer } from '../../react-encompass-ecs';

export function initGameWorld() {
  const worldBuilder = new WorldBuilder();
  worldBuilder.add_engine(TileMapSpawner);
  worldBuilder.add_engine(BoxSpawner);
  worldBuilder.add_engine(MotionEngine);
  worldBuilder.add_engine(VelocityEngine);

  const mapInstantizationMessage = worldBuilder.emit_message(MapInstantizationMessage);
  mapInstantizationMessage.mapDefinition = ``;

  const entityStore = new EntitySyncer();
  worldBuilder.add_renderer(entityStore.syncRenderer);
  const world = worldBuilder.build();
  return { world, entityStore };
}
