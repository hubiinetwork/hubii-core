export default (e) => {
  // eslint-disable-next-line no-alert
  alert(`Fatal Error: ${e}! The app has force closed to protect the integrity of your wallet data.`);
  process.exit();
};
