Examples:

```js
const options = [
  {
    accountName: 'Striim Account 1',
    amount: 6090.03,
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
<div style={{ backgroundColor: '#26404D', padding: 25 }}>
  <AccountInfo
    options={options}
    onSelectChange={() => {
      console.log('selected item changed');
    }}
  />
</div>;
```
