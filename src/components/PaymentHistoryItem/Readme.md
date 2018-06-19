A variant of PaymentHistoryItem:

```js
const date = new Date(2016, 2);
const show = {
  coin: 'AIR',
  coinAmount: 212,
  USDAmount: 434,
  to: '0xb2682160c482eB985EC9F3e364eEc0a904C44C23',
  type: 'Deposit',
  toID: '0xb2682160c482eB985EC9F3e364eEc0a904C44C23',
  hashID: '0xb2682160c482eB985EC9F3e364eEc0a904C44C23',
  timeStamp: date,
  blockHeight: 23112,
  gasLimit: 21000,
  gasTxn: 21001,
  gasPrice: 0.0003,
  cost: 0.000063,
  exchangeRate: 0.2,
  confirmationBlocks: 3
};
<div style={{ backgroundColor: 'rgb(38, 64, 77)', padding: 10 }}>
  <PaymentHistoryItem data={show} />
</div>;
```
