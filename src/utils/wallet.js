export function getWalletsLocalStorage() {
  const defaultState = { software: {}, hardware: {} };
  try {
    const wallets = JSON.parse(localStorage.getItem('wallets')) || defaultState;
    return wallets;
  } catch (e) {
    return defaultState;
  }
}

export function convertWalletsList(walletsState) {
  const walletsJSON = walletsState.toJS();
  const wallets = [];
  Object.keys(walletsJSON).forEach((type) => {
    Object.keys(walletsJSON[type]).forEach((walletName) => {
      try {
        const wallet = walletsJSON[type][walletName];
        wallet.encrypted = JSON.parse(wallet.encrypted);
        wallet.type = type;
        wallet.name = walletName;
        wallets.push(wallet);
      } catch (e) {
        return e;
      }
      return walletName;
    });
    return type;
  });
  return wallets;
}
