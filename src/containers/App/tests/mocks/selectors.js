import { fromJS } from 'immutable';
import { SUPPORTED_NETWORKS } from 'config/constants';

// makeSelectSupportedNetworks
export const supportedNetworksMock = fromJS(SUPPORTED_NETWORKS);

// makeSelectCurrentNetwork
export const currentNetworkMock = SUPPORTED_NETWORKS.ropsten;

// selectAppDomain
export const appMock = fromJS({
  supportedNetworks: supportedNetworksMock,
  currentNetwork: currentNetworkMock,
});
