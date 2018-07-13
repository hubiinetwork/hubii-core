A variant of Breakdown component:

```js
<div style={{ backgroundColor: '#26404D', padding: 25 }}>
  <Breakdown
    data={[
      { label: 'ICX', percentage: 16, color: '#3df5cd' },
      { label: 'EOS', percentage: 25.5, color: 'black' },
      { label: 'ETH', percentage: 28.5, color: '#627EEA' },
      {
        label: 'TRX',
        percentage: 20.69,
        color: 'rgba(255,255,255,0.5)'
      },
      { label: 'HBT', percentage: 16.8, color: '#0063A5' },
      { label: 'SNT', percentage: 10.54, color: '#5C6DED' },
      { label: 'SALT', percentage: 8.6, color: '#1BEEF4' },
      { label: 'OMG', percentage: 5.35, color: '#0666FF' },
      { label: 'REP', percentage: 4.2, color: '#602453' },
      { label: 'QSP', percentage: 2.24, color: '#454545' },
      { label: 'ZRX', percentage: 1.65, color: '#FFFFFF' }
    ]}
    value={`24,891.7`}
  />
</div>
```
