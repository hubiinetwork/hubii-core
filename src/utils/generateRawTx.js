import EthereumTx from 'ethereumjs-tx';

export default (payload) => {
  const txParams = {
    to: payload.toAddress,
    value: payload.amount,
    gasPrice: payload.gasPrice,
    gasLimit: payload.gasLimit,
    nonce: 0,
  };
  return new EthereumTx(txParams);
};
