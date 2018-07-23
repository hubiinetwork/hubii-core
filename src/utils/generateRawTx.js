import EthereumTx from 'ethereumjs-tx';

export default (payload) => {
  const txParams = {
    to: payload.toAddress,
    value: payload.amount.toNumber(),
    gasPrice: payload.gasPrice,
    gasLimit: payload.gasLimit,
    nonce: payload.nonce,
    chainId: payload.chainId,
  };
  return new EthereumTx(txParams);
};
