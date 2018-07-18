import Eth from '@ledgerhq/hw-app-eth';
import LedgerTransport from '@ledgerhq/hw-transport-node-hid';

export const createTransport = () => LedgerTransport.create();

export const newEth = (transport) => new Eth(transport);
