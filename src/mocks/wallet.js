import { fromJS } from 'immutable';

export const privateKeyMock = '0x409300caf64bdf96a92d7f99547a5d67702fbdd759bbea4ca19b11a21d9c8528';
export const privateKeyNoPrefixMock = '409300caf64bdf96a92d7f99547a5d67702fbdd759bbea4ca19b11a21d9c8528';
export const addressMock = '0xA0EcCD7605Bb117DD2A4Cd55979C720Cf00F7fa4';
export const encryptedMock = '{"address":"a0eccd7605bb117dd2a4cd55979c720cf00f7fa4","id":"72b4922e-3785-4f0d-8c8c-b18c45ee431a","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"673d20bb45325d1f9cff0803b6fc9bd4"},"ciphertext":"6d72b87ed428d191730880ec10b24e10024d6fcccc51d0d306a111af35d9e557","kdf":"scrypt","kdfparams":{"salt":"1b62a7c98ca890b8f87a8dc06d958a8361057e2739f865691e6fb19c969f9d0c","n":131072,"dklen":32,"p":1,"r":8},"mac":"56569c22a1008b6a55e15758a4d3165bf1dbbdd3cb525ba42a0ee444394f1993"}}';

export const softwareSignedTransactionMock = {
  nonce: 49,
  gasPrice: 1,
  gasLimit: 1,
  to: '0xBFdc0C8e54aF5719872a2EdEf8e65c9f4A3eae88',
  value: 1,
  data: '0x',
  v: 42,
  r: '0x715935bf243f0273429ba09b2c65ff2d15ca3a8b18aecc35e7d5b4ebf5fe2f56',
  s: '0x32aacbc76007f51de3c6efedad074a6b396d2a35d9b6a49ad0b250d40a7f046e',
  chainId: 3,
  from: '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a',
  hash: '0x3c63ecb423263552cfc3e373778bf8244d490b06823b4b2f3203343ecb8f0518',
};
export const confirmedTransactionMock = {
  ...softwareSignedTransactionMock,
  blockHash: '0x756da99f6be563b86238a162ee2586b0236e3e87c62cde69426ff7bab71d6066',
  blockNumber: 3558042,
  transactionIndex: 9,
  raw: 'raw',
};
export const formatedTransactionMock = {
  timestamp: 1532656737806,
  token: 'ETH',
  from: '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a',
  to: '0xBFdc0C8e54aF5719872a2EdEf8e65c9f4A3eae88',
  hash: '0x3c63ecb423263552cfc3e373778bf8244d490b06823b4b2f3203343ecb8f0518',
  value: 1,
  input: '0x',
  success: true,
  original: confirmedTransactionMock,
};
export const transferActionParamsMock = {
  token: 'ETH',
  toAddress: '0xBFdc0C8e54aF5719872a2EdEf8e65c9f4A3eae88',
  amount: 0.0001,
  gasPrice: 30000,
  gasLimit: 21000,
  wallet: fromJS({ encrypted: {}, decrypted: {} }),
};

export const lnsSignedTxMock = {
  v: '2a',
  r: '7140f2dbd69f235c5ba229da1651a8c30062213a8a3a27f424a177cc01189fd8',
  s: '1b7384730b63b8a70bababc3999c00bd99ed7fbd4c5c7e74cabcfa4d3133d119',
};

export const lnsExpectedSignedTxHex = '0xf8671082753082520894bfdc0c8e54af5719872a2edef8e65c9f4a3eae88865af3107a4000802aa07140f2dbd69f235c5ba229da1651a8c30062213a8a3a27f424a177cc01189fd8a01b7384730b63b8a70bababc3999c00bd99ed7fbd4c5c7e74cabcfa4d3133d119';
