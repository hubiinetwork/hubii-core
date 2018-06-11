Example:

```js
<div style={{ backgroundColor: '#26404D', padding: 25 }}>
  <LastTransaction
    coin="ICX"
    coinAmount={181.68}
    coinAmountUSD={386.9784}
    name="Jim Nguyen"
    address="0xFBb1b73C4f0BDc4f67dcA266ce6Ef42f50011111"
    date="6 jan 2018"
    time="05 : 16 pm"
    gmt="+1"
    handleNewTransfer={() => {
      console.log('new transfer button clcked');
    }}
  />
</div>
```
