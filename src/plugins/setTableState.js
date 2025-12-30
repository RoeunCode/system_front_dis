function setTableState(key, value, ttlMinutes = 30) {
  if (!key) return null;
  if (!value) return null;
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttlMinutes * 60 * 1000, // default 30 minutes
  };
  localStorage.setItem(`table-state-${key}`, JSON.stringify(item));
}

export default setTableState;
