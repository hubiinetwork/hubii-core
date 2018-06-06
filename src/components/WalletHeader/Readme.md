Examples:

```js
<WalletHeader
  iconType="home"
  name="Ledger Nano S"
  address="0X21234asdq23d23234d"
  balance={12.34}
  onIconClick={() => {
    console.log('clicked first header icon');
  }}
/>
```

```js
<WalletHeader
  iconType="home"
  name="Wallet"
  address="0X21234asdq23d23234d"
  balance={0.91}
  onIconClick={() => {
    console.log('clicked second header icon');
  }}
/>
```
