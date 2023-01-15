import React from 'react';

export type IntervalCallback<T = unknown> = () => T | Promise<T>;

export function useInterval<T>(callback: IntervalCallback<T>, delayMS: number) {
  const savedCallback = React.useRef<IntervalCallback<T>>();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const tick = savedCallback.current;

    if (tick) {
      const intervalHandle = setInterval(tick, delayMS);
      return () => {
        clearInterval(intervalHandle);
      };
    }
  }, [callback, delayMS]);
}
