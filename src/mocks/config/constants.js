import { providers } from 'ethers';
import * as configs from '../../config/constants';

configs.SUPPORTED_NETWORKS.ropsten.provider = new providers.JsonRpcProvider('http://localhost:8545', 'ropsten');

export * from '../../config/constants';
