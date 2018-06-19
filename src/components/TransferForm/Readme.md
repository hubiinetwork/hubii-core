Sample of TransferForm:

```js
<div style={{ padding: 25, backgroundColor: '#26404D' }}>
  <TransferForm
    address="0xf400db37c54c535febca1b470fd1d23d30acdd11"
    recipients={[
      { name: 'Jacobo', address: '0xf400db37c54c535febca1b470fd1d23d30ac12wd' },
      { name: 'Liam', address: '0xf400db37c54c535febca1b470fd1d23d30acdd11' },
      { name: 'Kata', address: '0xf400db37c54c535febca1b470fd1d23d30agh65' }
    ]}
    currencies={[
      { coin: 'ETH', rateUSD: '200' },
      { coin: 'ICX', rateUSD: '129' },
      { coin: 'HBT', rateUSD: '110' }
    ]}
  />
</div>
```
