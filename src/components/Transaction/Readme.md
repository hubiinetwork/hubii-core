
```js
const address = '0xb2682160c482eB985EC9F3e364eEc0a904C44C23';
<div style={{ backgroundColor: 'grey', padding: 10 }}>
  <Transaction
    time={ new Date('January 09, 1995 05:19:09') }
    counterpartyAddress={address}
    amount='0.000000000000000001'
    fiatEquivilent="$123.34 USD"
    symbol="UKG"
    confirmations="204"
    type="sent"
    viewOnBlockExplorerClick={() => {
      console.log('viewOnBlockExplororClick');
    }}
  />
</div>;
```

```js
const address = '0xb2682160c482eB985EC9F3e364eEc0a904C44C23';
<div style={{ backgroundColor: 'grey', padding: 10 }}>
  <Transaction
    time={ new Date('January 09, 1995 05:19:09') }
    viewOnBlockExplorerClick={() => {
      console.log('viewOnBlockExplororClick');
    }}
    counterpartyAddress={address}
    amount='0.000000000000000001'
    fiatEquivilent="$123.34 USD"
    symbol="UKG"
    confirmations="204"
    type="received"
  />
</div>;
```