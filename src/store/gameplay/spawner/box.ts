import { Reads, Spawner } from 'encompass-ecs';
import { TileComponent } from '../components/tile';
import { MapInstantizationMessage } from '../messages/tileMap';
import { PositionComponent } from '../components/position';
import { VelocityComponent } from '../components/velocity';
import { ReactSyncComponent } from '../../../react-encompass-ecs/component';

@Reads(MapInstantizationMessage)
export class BoxSpawner extends Spawner {
  public spawn(message: MapInstantizationMessage) {
    const boxEntity = this.create_entity();
    boxEntity.add_component(ReactSyncComponent);
    const position = boxEntity.add_component(PositionComponent);
    position.x = 0;
    position.y = 0;
    const velocity = boxEntity.add_component(VelocityComponent);
    velocity.x = 10;
    velocity.y = 10;
  }
}
