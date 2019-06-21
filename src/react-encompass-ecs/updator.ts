import { useState } from 'react';
import { updaterContext } from './sync';

function useForceUpdate() {
  const [value, set] = useState(true);
  return () => set(!value);
}

export function useUpdate() {
  // force update component on component value change, since what we get till now is just a reference, it won't change despite of internal value changed by ecs engines
  const forceUpdate = useForceUpdate();
  // updaterContext.subscribe(() => console.log('called'))
  updaterContext.subscribe(forceUpdate);
}
