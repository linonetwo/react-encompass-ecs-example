import { Entity } from 'encompass-ecs';
import { TileComponent } from '../../components/tile'

export default function createComponentsFromMapDefinition(definition: string, mapEntity: Entity): void {
  const tileComponent = mapEntity.add_component(TileComponent);
  tileComponent.x = 0;
  tileComponent.y = 0;
  tileComponent.tileType = '@linonetwo/basicRoad';
}