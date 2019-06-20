import { ComponentMessage, Message } from 'encompass-ecs';
import { PositionComponent } from '../../components/position';

export class MotionMessage extends Message implements ComponentMessage {
  public component: Readonly<PositionComponent>;
  public x: number;
  public y: number;
}
