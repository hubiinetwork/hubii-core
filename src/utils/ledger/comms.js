import Eth from '@ledgerhq/hw-app-eth';
import LedgerTransport from '@ledgerhq/hw-transport-node-hid';

export const createTransport = () => LedgerTransport.create();

export const newEth = (transport) => new Eth(transport);

export const createEthTransportActivity = async (descriptor, activityFn) => {
  let transport;
  try {
    if (process.platform === 'win32') {
      transport = await LedgerTransport.create();
    } else {
      transport = await LedgerTransport.open(descriptor);
    }
    const ethTransport = new Eth(transport);
    const result = await activityFn(ethTransport);
    return result;
  } catch (e) {
    console.log('error', e);
  } finally {
    if (transport) {
      await transport.close();
    }
  }
  return null;
};
