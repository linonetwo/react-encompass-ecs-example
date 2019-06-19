import { Reads, Spawner } from 'encompass-ecs';
import { TileComponent } from '../components/tile';
import { MapInstantizationMessage } from '../messages/tileMap';
import createComponentsFromMapDefinition from '../utils/transformation/createComponentsFromMapDefinition';

@Reads(MapInstantizationMessage)
export class TileMapSpawner extends Spawner {
  public spawn(message: MapInstantizationMessage) {
    const mapEntity = this.create_entity();

    createComponentsFromMapDefinition(message.mapDefinition, mapEntity);
  }
}
