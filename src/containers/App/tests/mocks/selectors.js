import { fromJS } from 'immutable';
import { SUPPORTED_NETWORKS } from 'config/constants';

// makeSelectSupportedNetworks
const supportedNetworks = fromJS(SUPPORTED_NETWORKS);
export const supportedNetworksMock = supportedNetworks
  .setIn(['mainnet', 'nahmiiProvider'], supportedNetworks.getIn(['mainnet', 'defaultNahmiiProvider']))
  .setIn(['ropsten', 'nahmiiProvider'], supportedNetworks.getIn(['ropsten', 'defaultNahmiiProvider']));

// makeSelectCurrentNetwork
export const currentNetworkMock = supportedNetworksMock.toJS().ropsten;

// selectAppDomain
export const appMock = fromJS({
  supportedNetworks: supportedNetworksMock,
  currentNetwork: currentNetworkMock,
});
