A variant of Balance component with title and balance:

```js
<div style={{ padding: 25, backgroundColor: '#26404d' }}>
  <Balance title="Available Balance" coin="HBT" balance={'12,121'} />
</div>
```

A variant of Balance component without coin and info true:

```js
<div style={{ padding: 25, backgroundColor: '#26404d' }}>
  <Balance
    title="Available Balance"
    info
    balance="1,234.09"
    showCoinName="HBT"
    showDollar
  />
</div>
```
