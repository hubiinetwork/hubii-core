A variant of TransactionHistoryItem:

```js
const address = '0xb2682160c482eB985EC9F3e364eEc0a904C44C23';
<div>
  <TransactionHistoryItem
    data={{
      date: 'APR 27',
      address: `${address}`,
      time: '2:18PM',
      amount: 0.0001111,
      hashId:
        '0xb2682160c482eB985EC9F3e364eEc0a904C44C2360c482eB985EC9F3e364eEc0a904C44C23',
      to: '60c482eB985EC9F3e364eEc0a904C44C23',
      from: '60c482eB985EC9F3e364eEc0a904C44C23',
      coin: 'UKG'
    }}
    price={671.23}
    key={
      '0xb2682160c482eB985EC9F3e364eEc0a904C44C2360c482eB985EC9F3e364eEc0a904C44C23'
    }
  />;
  <TransactionHistoryItem
    data={{
      date: 'APR 27',
      address: `${address}`,
      time: '2:18PM',
      amount: 0.0001111,
      hashId:
        '0xb2682160c482eB985EC9F3e364eEc0a904C44C2360c482eB985EC9F3e364eEc0a904C44C23',
      to: '0xb2682160c482eB985EC9F3e364eEc0a904C44C23',
      from: '60c482eB985EC9F3e364eEc0a904C44C23',
      coin: 'VEE'
    }}
    price={671.23}
    key={
      '0xb2682160c482eB985EC9F3e364eEc0a904C44C2360c482eB985EC9F3e364eEc0a904C44C23'
    }
  />
  <TransactionHistoryItem
    data={{
      date: 'APR 27',
      time: '2:18PM',
      amount: 0.0001111,
      toCoin: 'ADX',
      fromCoin: 'AIR'
    }}
    price={671.23}
    key={
      '0xb2682160c482eB985EC9F3e364eEc0a904C44C2360c482eB985EC9F3e364eEc0a904C44C23'
    }
  />
</div>;
```
