Examples:

```js
const currencies = [
  { name: 'ETH', balance: 1.123, rate: 245 },
  { name: 'ICX', balance: 3.343, rate: 540 },
  { name: 'OMG', balance: 0.23, rate: 983 }
];
const wallets = ['Ledger Nano S', 'Ledger 2', 'Ledger 3'];
<div style={{ padding: 25, backgroundColor: '#26404d' }}>
  <CreateStriimModal
    currencies={currencies}
    wallets={wallets}
    handleSubmit={values => {
      console.log(values);
    }}
  />
</div>;
```
