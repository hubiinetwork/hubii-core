Variants of ImportWalletKeystoreForm:

```js
<div
  style={{
    backgroundColor: '#2f4d5c',
    padding: 25,
    width: 576,
    height: 576
  }}
>
  <ImportWalletKeystoreForm
    handleNext={() => console.log("handleNext")}
    handleNext={() => console.log("handleBack")}
    loading={false}
  />
</div>
```

```js
<div
  style={{
    backgroundColor: '#2f4d5c',
    padding: 25,
    width: 576,
    height: 576
  }}
>
  <ImportWalletKeystoreForm
    handleNext={() => console.log("handleNext")}
    handleNext={() => console.log("handleBack")}
    loading
  />
</div>
```