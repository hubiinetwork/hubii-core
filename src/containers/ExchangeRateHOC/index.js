import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import reducer from './reducer';
import saga from './saga';

const withReducer = injectReducer({ key: 'exchangeRates', reducer });
const withSaga = injectSaga({ key: 'exchangeRates', saga });

export default compose(
    withReducer,
    withSaga,
);
