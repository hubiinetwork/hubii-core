Variant of DerivationPath:

```js
const paths = [
  {
    title: 'm/44’/60’/0’/3',
    subtitle: 'Jaxx, Metamask, Exodus, imToken, TREZOR (ETH) & Digital Bitbox'
  },
  {
    title: 'm/44’/60’/0',
    subtitle: 'Ledger (ETH)'
  },
  {
    title: 'm/44’/60’/0’/5',
    subtitle: 'TREZOR (ETC)'
  },
  {
    title: 'm/44’/60’/160720’/0’',
    subtitle: 'Ledger (ETC)'
  },
  {
    title: 'm/44’/60’/0’/7',
    subtitle: 'SingularDTV'
  },
  {
    title: 'm/44’/60’/0’/1',
    subtitle: 'Network: Testnets'
  },
  {
    title: 'm/44’/60’/0’/9',
    subtitle: 'Network: Expanse'
  }
];
const addressData = [
  {
    key: '1',
    address: '042f500111f0BDc4f6711xFBb1b73C4dcA266ce6Ef',
    balance: '0.05 ETH',
    tokenBalance: 123
  },
  {
    key: '2',
    address: '03C4f0BDc4xFA266cBb1b7f67dce6Ef42f01111150',
    balance: '0.05 ETH',
    tokenBalance: 321
  },
  {
    key: '3',
    address: '0xFBb150011BDc4f6111b73C4f07dcA266Ef426cef',
    balance: '0.05 ETH',
    tokenBalance: 542
  }
];

<div style={{ backgroundColor: '#26404D', padding: 25, maxWidth: 803 }}>
  <DerivationPath
    walletName={'Ledger'}
    paths={paths}
    addresses={addressData}
    handleSubmit={values => console.log(values)}
  />
</div>;
```
