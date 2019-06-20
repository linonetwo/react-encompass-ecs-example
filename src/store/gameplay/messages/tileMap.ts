import { Message } from 'encompass-ecs';

export class MapInstantizationMessage extends Message {
  public mapDefinition: string;
}
