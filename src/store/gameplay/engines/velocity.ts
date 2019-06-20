import { Detector, Detects, Emits, Entity } from 'encompass-ecs';
import { PositionComponent } from '../components/position';
import { VelocityComponent } from '../components/velocity';
import { MotionMessage } from '../messages/components/motion';

@Emits(MotionMessage)
@Detects(PositionComponent, VelocityComponent)
export class VelocityEngine extends Detector {
  protected detect(entity: Entity) {
    const positionComponent = entity.get_component(PositionComponent);
    const velocityComponent = entity.get_component(VelocityComponent);

    const motionMessage = this.emit_component_message(MotionMessage, positionComponent);
    motionMessage.x = velocityComponent.x;
    motionMessage.y = velocityComponent.y;
  }
}
