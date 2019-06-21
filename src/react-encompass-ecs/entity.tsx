import React, { useEffect, createContext, useContext, Context, useMemo } from 'react';
import { Component, Entity, EntityChecker, Type } from 'encompass-ecs';
import { GCOptimizedList } from 'encompass-gc-optimized-collections';
import { useImmer } from 'use-immer';
import { flatten, mapValues } from 'lodash';

export interface IEntityMap {
  [name: string]: Entity;
}

export const GameEntitiesContext = createContext<IEntityMap>({});

/**
 * Select entity with provided components, return components inside entity
 * ```js
 *   const { box } = useComponents({ box: [PositionComponent] });
 *   const position = box ? box[0] : { x: 20, y: 20 };
 * ```
 * Above example return singleton component inside box, if you warp some component in array, it will return an array of that type of components (not supported now due to my TypeScript knowledge limitation)
 */
export function useComponent<TComponent extends Component, T extends Type<TComponent> /* | Array<Type<TComponent>> */>(
  descriptions: { [name: string]: /* T[] */ Array<Type<TComponent>> },
  context: Context<IEntityMap> = GameEntitiesContext,
): {
  [name: string]: Array<
    /* T extends Array<Type<TComponent>> ? GCOptimizedList<Readonly<TComponent>> : */ Readonly<TComponent>
  >;
} {
  const [selectedEntities, setter] = useImmer<IEntityMap>({});
  const entities = useContext(context);
  useEffect(() => {
    // select entities that match the components description
    setter(draft => {
      for (const name of Object.keys(descriptions)) {
        for (const entity of Object.values(entities)) {
          const components = descriptions[name];
          if (draft[name] !== entity && EntityChecker.check_entity(entity, flatten(components))) {
            draft[name] = entity;
          }
        }
      }
    });
    console.log('useEntity() useEffect called');
    // only rerun this selection if entities changes
  }, [setter, descriptions, entities]);
  console.log('useEntity() entities', entities, 'selectedEntities', selectedEntities);
  const selectedComponents = useMemo(
    () =>
      mapValues(selectedEntities, (entity, name) =>
        descriptions[name].map(component => {
          // if (Array.isArray(component)) {
          //   component as Array<Type<TComponent>>;
          //   return entity.get_components(component[0]);
          // }
          return entity.get_component(component);
        }),
      ),
    [descriptions, selectedEntities],
  );
  console.log('selectedComponents', selectedComponents);

  return selectedComponents;
}

export function Provider(props: { children: React.ReactNode; entities: IEntityMap; context?: Context<IEntityMap> }) {
  const ProvidedContext = props.context || GameEntitiesContext;
  console.log('Provider entities', props.entities);

  return <ProvidedContext.Provider value={props.entities}>{props.children}</ProvidedContext.Provider>;
}
