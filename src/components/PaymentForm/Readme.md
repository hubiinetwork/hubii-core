Variant of TopupForm component:

```js
const recipients = [
  '0x86ecabe4d265a11c06d3af979fedbc3a5b48b7c9b96d44af5b504d2bd2480687',
  '0x86ecabe4d265a11c06d3af979fedbc3a5b48b7c9b96d44af5b504d2bd2480687',
  '0x86ecabe4d265a11c06d3af979fedbc3a5b48b7c9b96d44af5b504d2bd2480687'
];
<div style={{ backgroundColor: '#26404D', padding: 25 }}>
  <PaymentForm
    currency={'HBT'}
    balance={1599.54}
    transactionFee={0.0012}
    recipients={recipients}
    rate={120}
    onSend={value => console.log('Sent', value)}
  />
</div>;
```
