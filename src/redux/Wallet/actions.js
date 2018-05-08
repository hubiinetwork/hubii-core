import ethers from 'ethers';
import {
  WALLETS_ERROR,
  WALLETS_LOADING,
  WALLETS_SUCCESS,
  WALLETS_DELETE
} from './constants';

const { Wallet } = ethers;

const creatingWallet = () => ({
  type: WALLETS_LOADING
});
const creatingWalletError = () => ({
  type: WALLETS_ERROR
});
const creatingWalletSuccess = wallet => ({
  type: WALLETS_SUCCESS,
  wallet
});

export function addWallet(walletInfo) {
  return dispatch => {
    dispatch(creatingWallet());
    const { mnemonic, name, password, type } = walletInfo;
    let wallet;
    try {
      wallet = Wallet.fromMnemonic(mnemonic);
      wallet.provider = ethers.providers.getDefaultProvider();
    } catch (err) {
      dispatch(creatingWalletError());
    }
    let encryptedWallet;
    return wallet
      .encrypt(password)
      .then(res => JSON.parse(res))
      .then(encryptWallet => {
        encryptedWallet = encryptWallet;
        return wallet.getBalance();
      })
      .then(balance => {
        const totalBalance = balance.toString();
        const finalWallet = {
          name,
          type,
          totalBalance,
          credentials: {
            ...encryptedWallet
          }
        };
        return dispatch(creatingWalletSuccess(finalWallet));
      })
      .catch(err => dispatch(creatingWalletError()));
  };
}

export function deleteWallet(walletAddress) {
  const address = walletAddress.toLowerCase().substring(2);
  return { type: WALLETS_DELETE, address };
}
