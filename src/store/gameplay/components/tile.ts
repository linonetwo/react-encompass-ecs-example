import { Component } from 'encompass-ecs';

export class TileComponent extends Component {
  public x: number;
  public y: number;
  /** a namespaced tile typename, for example, '@linonetwo/basicRoad' */
  public tileType: string;
}
