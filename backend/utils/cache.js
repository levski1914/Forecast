const cache = new Map();

const setCache = (key, data, ttl = 600000) => {
  cache.set(key, { data, expiry: Date.now() + ttl });
};

const getCache = (key) => {
  const cached = cache.get(key);

  if (!cached || cached.expiry < Date.now()) {
    cache.delete(key);
    return null;
  }

  return cached.data;
};

export { setCache, getCache };
