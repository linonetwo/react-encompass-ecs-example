import { Renders, EntityRenderer, Entity, Type } from 'encompass-ecs';
import { produce } from 'immer';
import { ReactSyncComponent } from './component';
import { IEntityMap } from './entity';

export class EntitySyncer {
  public entities: IEntityMap;
  public syncRenderer: Type<EntityRenderer>;

  constructor() {
    this.entities = {};
    const updateEntitiesStore = produce((draft, id, newEntity) => {
      draft[id] = newEntity;
    });
    const store = this;
    @Renders(ReactSyncComponent)
    class ReactSyncRenderer extends EntityRenderer {
      // this got called every render tick
      public render(currentEntity: Entity) {
        // put current entity into the resulting entity map, update the old one
        const id = currentEntity.get_component(ReactSyncComponent).entity_id;
        store.entities = updateEntitiesStore(store.entities, id, currentEntity);
        // console.log('ReactSyncRenderer entities', store.entities);
      }
    }
    this.syncRenderer = ReactSyncRenderer;
  }
}
