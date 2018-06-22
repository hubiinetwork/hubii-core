export function getWalletsLocalStorage() {
  const defaultState = { software: {}, hardware: {} }
  try {
    const wallets = JSON.parse(localStorage.getItem('wallets')) || defaultState;
    return wallets
  } catch (e) {
    return defaultState;
  }
}
