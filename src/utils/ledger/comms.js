import Eth from '@ledgerhq/hw-app-eth';
import LedgerTransport from '@ledgerhq/hw-transport-node-hid';

export const createTransport = () => LedgerTransport.create();

export const newEth = (transport) => new Eth(transport);

export const createEthTransportActivity = async (descriptor, activityFn) => {
  let transport;
  try {
    transport = await LedgerTransport.create();
    const ethTransport = new Eth(transport);
    const result = await activityFn(ethTransport);
    return result;
  } finally {
    if (transport) {
      await transport.close();
    }
  }
};
