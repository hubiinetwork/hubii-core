Variants of ImportWallet:

```js
const walletData = [
  {
    src:
      'https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png',
    value: 'ledger'
  },
  {
    src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
    value: 'metamask'
  },
  {
    src:
      'https://cdn-images-1.medium.com/max/1600/1*u3_I95cOdCBd3gBJrBd2Aw.png',
    value: 'parity'
  },
  {
    src: 'https://pbs.twimg.com/media/Cxy4iJVXcAMJr9y.png',
    value: 'digitalBitbox'
  },
  {
    src:
      'https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png',
    value: 'ledger1'
  },
  {
    src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
    value: 'metamask1'
  },
  {
    src:
      'https://cdn-images-1.medium.com/max/1600/1*u3_I95cOdCBd3gBJrBd2Aw.png',
    value: 'parity1'
  }
];
<div
  style={{
    backgroundColor: '#2f4d5c',
    padding: 25,
    width: 576,
    height: 576
  }}
>
  <ImportWallet wallets={walletData} />
</div>;
```
