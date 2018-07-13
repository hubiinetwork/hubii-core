Examples:

```
const data = [
  { coin: 'ETH', coinAmount: 1.5264, exchangeRate: {loading: true} },
  { coin: 'HBT', coinAmount: 1559.54, exchangeRate: {error: true} },
  { coin: 'OMG', coinAmount: 1.5264, exchangeRate: {price: 101} },
  { coin: 'ICX', coinAmount: 1559.54, exchangeRate: {price: 201} }
];
<div style={{ backgroundColor: '#26404D', padding: 25, width: 304 }}>
  <CurrencyList data={data} onCurrencySelect={(icon) => {console.log('selected icon is',icon)}} activeCurrency='ETH' />
</div>
```
