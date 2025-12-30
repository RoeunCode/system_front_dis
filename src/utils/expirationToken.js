const expirationToken = (exp) => {
  if (!exp) return true; // If there's no expiration, treat as expired
  return Date.now() > exp * 1000; // Convert seconds to milliseconds
};

export default expirationToken;
