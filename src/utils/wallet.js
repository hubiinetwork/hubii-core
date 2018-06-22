export function getWalletsLocalStorage() {
  let wallets = { software: {}, hardware: {} };
  try {
    wallets = JSON.parse(localStorage.getItem('wallets'));
  } catch (e) {
    return wallets;
  }
  return wallets;
}
