Variants of WalletItemCard:

```js
<WalletItemCard
  name={'Wallet 123'}
  totalBalance={100.231}
  primaryAddress={'0xda1736e3eb1969b608ca9334b5baf8e3760bb16a'}
  type="Hubii Wallet"
  assets={[
    {
      name: 'ETH',
      amount: 0.21
    },
    {
      name: 'HBT',
      amount: 23102
    }
  ]}
/>
```

```js
<WalletItemCard
  name={'Wallet 123'}
  totalBalance={100.231}
  primaryAddress={'0xda1736e3eb1969b608ca9334b5baf8e3760bb16a'}
  type="Hubii Wallet"
  assets={[
    {
      name: 'ETH',
      amount: 0.21
    },
    {
      name: 'HBT',
      amount: 23102
    }
  ]}
  connected={true}
/>
```

```js
<WalletItemCard
  name={'Wallet 123'}
  totalBalance={100.231}
  primaryAddress={'0xda1736e3eb1969b608ca9334b5baf8e3760bb16a'}
  type="Hubii Wallet"
  assets={[
    {
      name: 'ETH',
      amount: 0.21
    },
    {
      name: 'HBT',
      amount: 23102
    }
  ]}
  connected={false}
/>
```
