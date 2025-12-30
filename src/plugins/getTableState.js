function getTableState(key) {
  const itemStr = localStorage.getItem(`table-state-${key}`);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(`table-state-${key}`);
    return null;
  }

  return item.value;
}

export default getTableState;
