/* eslint global-require: 0 */

export default process.versions.electron
  ? require('@ledgerhq/hw-transport-node-hid').default
  : require('@ledgerhq/hw-transport-u2f').default;
