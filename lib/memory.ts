type MemoryItem = {
  id: string;
  key: string;
  value: any;
  createdAt: string;
};

const globalForMemory = globalThis as unknown as {
  devoMemory?: MemoryItem[];
};

export function getMemoryStore() {
  if (!globalForMemory.devoMemory) {
    globalForMemory.devoMemory = [];
  }
  return globalForMemory.devoMemory;
}

export function remember(key: string, value: any) {
  const item = {
    id: crypto.randomUUID(),
    key,
    value,
    createdAt: new Date().toISOString(),
  };
  getMemoryStore().push(item);
  return item;
}

export function recall(key?: string) {
  const store = getMemoryStore();
  if (!key) return store;
  return store.filter((item) => item.key === key || item.key.includes(key));
}

export function clearMemory() {
  globalForMemory.devoMemory = [];
}
