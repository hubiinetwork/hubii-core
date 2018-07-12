/* eslint global-require: 0 */

import isElectron from '../isElectron';

export default isElectron
  ? require('@ledgerhq/hw-transport-node-hid').default
  : require('@ledgerhq/hw-transport-u2f').default;
