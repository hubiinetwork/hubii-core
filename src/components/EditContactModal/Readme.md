Examples:

```js
<div style={{ backgroundColor: '#2f4d5c', padding: 25 }}>
<EditContactModal
  name="Edit modal1"
  address="abcaddress"
  onEdit={() => {
    console.log('Edit modal1  clicked');
  }}
  onDelete={() => {
    console.log('delete modal1 clicked');
  }}
/>
</div>
```

```js
<div style={{ backgroundColor: '#2f4d5c', padding: 25 }}>
<EditContactModal
  name="Edit modal2"
  address="abcaddress2"
  onEdit={() => {
    console.log('Edit modal2 clicked');
  }}
  onDelete={() => {
    console.log('delete modal2 clicked');
  }}
/>
</div>
```
