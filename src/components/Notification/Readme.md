A variant of Notification:

```js
const showNotification = (success, message) => {
  new Notification(success, message);
};
<button onClick={showNotification(true)}>See Notification</button>;
```
