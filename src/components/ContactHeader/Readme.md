Variants of ContactHeader:

```js
<div style={{ backgroundColor: '#2f4d5c', padding: 25 }}>
  <ContactHeader title={'Recent Contacts'} showSearch={true} />
</div>
```

```js
<div style={{ backgroundColor: '#2f4d5c', padding: 25 }}>
  <ContactHeader
    title={'Recent Contacts'}
    placeholder={'custom placeholder'}
    showSearch={true}
  />
</div>
```

```js
const titleTabs = [
  {
    title: 'All Contacts',
    TabContent: <div> All contents</div>
  },
  {
    title: 'Striim Contacts',
    TabContent: <div> Striim contents</div>
  }
];
<div style={{ backgroundColor: '#2f4d5c', padding: 25 }}>
  <ContactHeader
    titleTabs={titleTabs}
    showSearch={true}
    onTabChange={() => {
      console.log('Tab changed');
    }}
  />
</div>;
```
