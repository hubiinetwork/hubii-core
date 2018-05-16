A variant of PaymentHistoryItem:

```js
const show = {
  coin: 'AIR',
  coinAmount: 212,
  USDAmount: 434,
  to: '0xb2682160c482eB985EC9F3e364eEc0a904C44C23',
  type: 'Payment',
  toID: '0xb2682160c482eB985EC9F3e364eEc0a904C44C23',
  hashID: '0xb2682160c482eB985EC9F3e364eEc0a904C44C23',
  timeStamp: '21 April 2018 3:48 PM',
  timePast: '2 days',
  blockHeight: 23112,
  gasLimit: 21000,
  gasTxn: 21001,
  gasPrice: 0.0003,
  cost: 0.000063
};
<div style={{ backgroundColor: 'grey', padding: 10 }}>
  <PaymentHistoryItem data={show} />
</div>;
```
