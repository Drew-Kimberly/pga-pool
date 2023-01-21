import React from 'react';

import { LocalStorage, Storage } from '../api/storage';

export function usePersistedState<T>(
  defaultValue: T,
  key: string,
  storage: Storage = new LocalStorage()
) {
  const [value, setValue] = React.useState<T>(() => {
    const fromStorage = storage.get<T>(key);
    return fromStorage ?? defaultValue;
  });

  React.useEffect(() => {
    storage.set(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
