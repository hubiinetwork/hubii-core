A variant of PaymentHistoryDetail:

```js
const date = new Date(2011, 12, 21, 15, 36, 56, 12);
<div style={{ backgroundColor: 'grey', padding: 10 }}>
  <PaymentHistoryDetail
    data={{
      coin: 'HBT',
      coinAmount: 121,
      USDAmount: 663,
      to: '0xb2682160c482eB985EC9F3e364eEc0a904C44C23',
      type: 'Order',
      toID: '0xb2682160c482eB985EC9F3e364eEc0a904C44C23',
      hashID: '0xb2682160c482eB985EC9F3e364eEc0a904C44C23',
      timeStamp: date,
      blockHeight: 21243,
      gasLimit: 21001,
      gasTxn: 23109,
      gasPrice: 0.00003,
      exchangeRate: 0.7,
      cost: 0.000021,
      confirmationBlocks: 2
    }}
  />
</div>;
```
