import { fromJS } from 'immutable';
import { SUPPORTED_NETWORKS } from 'config/constants';
import { providers } from 'ethers';
// makeSelectSupportedNetworks
export const supportedNetworksMock = fromJS(SUPPORTED_NETWORKS);

// makeSelectCurrentNetwork
export const currentNetworkMock = {
  provider: providers.getDefaultProvider('ropsten'),
  walletApiEndpoint: 'https://api2.dev.hubii.net/',
  identityServiceSecret: 'ROPSTEN_IDENTITY_SERVICE_SECRET',
  identityServiceAppId: 'ROPSTEN_IDENTITY_SERVICE_APPID',
};

// selectAppDomain
export const appMock = fromJS({
  supportedNetworks: supportedNetworksMock,
  currentNetwork: currentNetworkMock,
});
