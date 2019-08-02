import { fromJS } from 'immutable';

import {
  walletHocMock,
} from 'containers/WalletHoc/tests/mocks/selectors';
import {
  hubiiApiHocMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';
import {
  nahmiiHocMock,
} from 'containers/NahmiiHoc/tests/mocks/selectors';
import {
  appMock,
} from 'containers/App/tests/mocks/selectors';
import {
  ethOperationsHocMock,
} from 'containers/EthOperationsHoc/tests/mocks/selectors';

export const storeMock = fromJS({
  app: appMock,
  nahmiiHoc: nahmiiHocMock,
  hubiiApiHoc: hubiiApiHocMock,
  walletHoc: walletHocMock,
  ethOperationsHoc: ethOperationsHocMock,
});
