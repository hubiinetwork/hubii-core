A variant of TransactionHistoryItem:

```js
const address = '0xb2682160c482eB985EC9F3e364eEc0a904C44C23';
<div style={{ backgroundColor: 'grey', padding: 10 }}>
  <TransactionHistoryItem
    data={{
      date: 'APR 27',
      address: `${address}`,
      time: '2:18PM',
      amount: 0.0001111,
      hashId:
        '0x4891ee9bc872f5ea35b1dd3b7384bdc4a4c26f63ee7036f83568c8612603ed63',
      to: '60c482eB985EC9F3e364eEc0a904C44C23',
      from: '60c482eB985EC9F3e364eEc0a904C44C23',
      coin: 'UKG'
    }}
    price={671.23}
    key={
      '0xb2682160c482eB985EC9F3e364eEc0a904C44C2360c482eB985EC9F3e364eEc0a904C44C23'
    }
  />
</div>;
```

```js
const address = '0xb2682160c482eB985EC9F3e364eEc0a904C44C23';
<div style={{ backgroundColor: 'grey', padding: 10 }}>
  <TransactionHistoryItem
    data={{
      date: 'APR 27',
      address: `${address}`,
      time: '2:18PM',
      amount: 0.0001111,
      hashId:
        '0x4891ee9bc872f5ea35b1dd3b7384bdc4a4c26f63ee7036f83568c8612603ed63',
      to: '0xb2682160c482eB985EC9F3e364eEc0a904C44C23',
      from: '60c482eB985EC9F3e364eEc0a904C44C23',
      coin: 'VEE'
    }}
    price={671.23}
    key={
      '0xb2682160c482eB985EC9F3e364eEc0a904C44C2360c482eB985EC9F3e364eEc0a904C44C23'
    }
  />
</div>;
```

```js
<div style={{ backgroundColor: 'grey', padding: 10 }}>
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
</div>
```
