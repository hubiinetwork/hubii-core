A variant of ImportWalletSteps:

```js
const walletData = [
  {
    src:
      'https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png',
    name: 'ledger',
  },
  {
    src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
    name: 'metamask',
  },
  {
    src:
      'https://cdn-images-1.medium.com/max/1600/1*u3_I95cOdCBd3gBJrBd2Aw.png',
    name: 'parity',
  },
  {
    src: 'https://pbs.twimg.com/media/Cxy4iJVXcAMJr9y.png',
    name: 'digitalBitbox',
  },
  {
    src:
      'https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png',
    name: 'ledger1',
  },
  {
    src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
    name: 'metamask1',
  },
  {
    src:
      'https://cdn-images-1.medium.com/max/1600/1*u3_I95cOdCBd3gBJrBd2Aw.png',
    name: 'parity1',
  },
  {
    src: 'https://pbs.twimg.com/media/Cxy4iJVXcAMJr9y.png',
    name: 'digitalBitbox1',
  },
  {
    src: 'https://pbs.twimg.com/media/Cxy4iJVXcAMJr9y.png',
    name: 'digitalBitbox2',
  },
  {
    src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
    name: 'metamask2',
  },
];
<div
  style={{
    backgroundColor: '#2f4d5c',
    padding: 25,
    flex: 1,
    padding: 25, maxWidth: 803 ,
    height: 576,
    display: 'flex'
  }}
>
  <ImportWalletSteps
  handleSubmit={(data) => {console.log('data from all steps', data)}}
  onBackIcon={() => {console.log('back icon clicked')}}
  wallets={walletData}
  />
</div>
```
