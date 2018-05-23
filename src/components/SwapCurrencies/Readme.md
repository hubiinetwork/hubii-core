A variant of SwapCurrencies component with title and balance:

```js
<div style={{ padding: 25, backgroundColor: '#26404d' }}>
  <SwapCurrencies
    exchangeCoin="HBT"
    receiveCoin="ETH"
    exchangeBalance={1599.45}
    receiveBalance={1230.01}
    exchangeAmount={450}
    receiveAmount={405}
    exchangeAmountInDollar={300.59}
    receiveAmountInDollar={298.03}
    oneExchangeInReceive={0.0001987231}
  />
</div>
```
