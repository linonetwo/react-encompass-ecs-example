import React, { useEffect, createContext, useContext, Context } from 'react';
import { Component, Entity, Type, EntityChecker } from 'encompass-ecs';
import { useImmer } from 'use-immer';

export interface IEntityMap {
  [name: string]: Entity;
}

export const GameEntitiesContext = createContext<IEntityMap>({});

export function useEntity<TComponent extends Component>(
  descriptions: { [name: string]: Array<Type<TComponent>> },
  context: Context<IEntityMap> = GameEntitiesContext,
) {
  const [result, setter] = useImmer<IEntityMap>({});
  const entities = useContext(context);
  useEffect(() => {
    // select entities that match the components description
    setter(draft => {
      for (const name of Object.keys(descriptions)) {
        for (const entity of Object.values(entities)) {
          const components = descriptions[name];
          if (draft[name] !== entity && EntityChecker.check_entity(entity, components)) {
            draft[name] = entity;
          }
        }
      }
    });
    console.log('useEntity() useEffect called');
    // only rerun this selection if entities changes
  }, [setter, descriptions, entities]);
  console.log('useEntity() entities', entities, 'result', result);
  return result;
}

export function Provider(props: { children: React.ReactNode; entities: IEntityMap; context?: Context<IEntityMap> }) {
  const ProvidedContext = props.context || GameEntitiesContext;
  console.log('Provider entities', props.entities);
  
  return <ProvidedContext.Provider value={props.entities}>{props.children}</ProvidedContext.Provider>;
}
