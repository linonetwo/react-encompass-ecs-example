import { Engine, Mutates, Reads } from 'encompass-ecs';
import { PositionComponent } from '../components/position';
import { MotionMessage } from '../messages/components/motion';

@Reads(MotionMessage)
@Mutates(PositionComponent)
export class MotionEngine extends Engine {
  public update(dt: number) {
    const motionMessages = this.read_messages(MotionMessage);
    for (const message of motionMessages.values()) {
      const positionComponent = this.make_mutable(message.component);
      positionComponent.x += message.x * dt / 1000;
      positionComponent.y += message.y * dt / 1000;
    }
  }
}

