export interface Storage {
  get<T>(key: string): T | undefined;
  set(key: string, data: unknown): void;
  delete(key: string): void;
  clear(): void;
}

export class LocalStorage implements Storage {
  get<T>(key: string): T {
    const val = window.localStorage.getItem(key);
    return val ? JSON.parse(val).data : undefined;
  }

  set(key: string, data: unknown): void {
    const serialized = JSON.stringify({ data });
    window.localStorage.setItem(key, serialized);
  }

  delete(key: string): void {
    window.localStorage.removeItem(key);
  }

  clear() {
    window.localStorage.clear();
  }
}

export class SessionStorage implements Storage {
  get<T>(key: string): T {
    const val = window.sessionStorage.getItem(key);
    return val ? JSON.parse(val).data : undefined;
  }

  set(key: string, data: unknown): void {
    const serialized = JSON.stringify({ data });
    window.sessionStorage.setItem(key, serialized);
  }

  delete(key: string): void {
    window.sessionStorage.removeItem(key);
  }

  clear() {
    window.sessionStorage.clear();
  }
}
