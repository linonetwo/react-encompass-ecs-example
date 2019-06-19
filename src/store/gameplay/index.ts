import { World, WorldBuilder } from 'encompass-ecs';
import { TileComponent } from './components/tile';
import { TileMapSpawner } from './spawner/tileMap';
import { MapInstantizationMessage } from './messages/tileMap';

export function initGameWorld() {
  const worldBuilder = new WorldBuilder();
  worldBuilder.add_engine(TileMapSpawner);
  const mapInstantizationMessage = worldBuilder.emit_message(MapInstantizationMessage);
  mapInstantizationMessage.mapDefinition = ``;
  return worldBuilder.build();
}
