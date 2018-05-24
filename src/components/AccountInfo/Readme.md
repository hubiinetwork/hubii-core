Examples:

```js
const options = [
  {
    accountName: 'Striim account 1',
    amount: 60923.4,
    handleIconClick: () => {
      console.log('icon1 clicked');
    }
  },
  {
    accountName: 'Striim account 2',
    amount: 100443.4,
    handleIconClick: () => {
      console.log('icon2 clicked');
    }
  },
  {
    accountName: 'Striim account 3',
    amount: 34002.4,
    handleIconClick: () => {
      console.log('icon3 clicked');
    }
  }
];
<div style={{ backgroundColor: '#2f4d5c', padding: 25 }}>
  <AccountInfoDropdown options={options} />
</div>;
```
