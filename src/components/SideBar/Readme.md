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
    icon: 'striim',
    name: 'striim detail'
  },
  {
    to: '/dex',
    icon: 'dex',
    name: 'dex detail'
  }
];
<SideBar menuItems={menuItems} logoSrc="../../../public/Images/corerz-logo.svg">
  <p>children</p>
</SideBar>;
```
