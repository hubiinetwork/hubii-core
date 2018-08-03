
```js
const address = '0xb2682160c482eB985EC9F3e364eEc0a904C44C23';
<div style={{ backgroundColor: 'grey', padding: 10 }}>
  <TransactionHistoryItem
    data={{
      address: `${address}`,
      time: new Date('January 09, 1995 05:19:09'),
      amount: '0.000000000000000001',
      txnId:
        '0x4891ee9bc872f5ea35b1dd3b7384bdc4a4c26f63ee7036f83568c8612603ed63',
      to: '60c482eB985EC9F3e364eEc0a904C44C23',
      from: '60c482eB985EC9F3e364eEc0a904C44C23',
      fiatValue: '987.365',
      coin: 'UKG',
      confirmations: 204
    }}
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
      address: `${address}`,
      time: new Date('February 17, 1995 23:24:00'),
      amount: '0.0011',
      fiatValue: '987.365',
      txnId:
        '0x4891ee9bc872f5ea35b1dd3b7384bdc4a4c26f63ee7036f83568c8612603ed63',
      to: '0xb2682160c482eB985EC9F3e364eEc0a904C44C23',
      from: '60c482eB985EC9F3e364eEc0a904C44C23',
      coin: 'VEE',
      confirmations: 204
    }}
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
      time: new Date('October 23, 1995 17:24:00'),
      amount: '0.011',
      fiatValue: '987.365',
      toCoin: 'ADX',
      fromCoin: 'AIR',
      confirmations: 204
    }}
    key={
      '0xb2682160c482eB985EC9F3e364eEc0a904C44C2360c482eB985EC9F3e364eEc0a904C44C23'
    }
  />
</div>
```
