A variant of SwapCurrencies component with title and balance:

```js
<div style={{ padding: 25, backgroundColor: '#26404d' }}>
  <SwapCurrencies
    exchangeCoin="HBT"
    receiveCoin="ETH"
    exchangeBalance={1599.54}
    receiveBalance={1.5264}
    exchangeAmount={450}
    receiveAmount={0.4564}
    exchangeAmountInDollar={300.59}
    receiveAmountInDollar={298.456}
    oneExchangeInReceive={0.0001987231}
  />
</div>
```
