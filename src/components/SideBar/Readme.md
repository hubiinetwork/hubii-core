A variant of SideBar:

```js
const menuItems = [
  {
    to: '/wallets',
    icon: 'wallet',
    name: 'Wallet Manager'
  },
  {
    to: '/wallet',
    icon: 'wallet',
    name: 'Wallet detail'
  }
];
<SideBar menuItems={menuItems} logoSrc="../../../public/Images/corerz-logo.svg">
  <p>children</p>
</SideBar>;
```
