import React from 'react';
import { shallow } from 'enzyme';
import { Set, fromJS } from 'immutable';
import { intl } from 'jest/__mocks__/react-intl';

import { ConnectionStatus } from '../index';

describe('<ConnectionStatus />', () => {
  let props;
  beforeEach(() => {
    props = {
      currentNetwork: { provider: { _network: { chainId: 1 } } },
      blockHeight: fromJS({ height: 1 }),
      errors: new Set(),
      intl,
    };
  });

  it('should render correctly when network is mainnet & no errors', () => {
    const wrapper = shallow(<ConnectionStatus {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when network is testnet', () => {
    const wrapper = shallow(
      <ConnectionStatus
        {...props}
        currentNetwork={{ provider: { _network: { chainId: 3 } } }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when errors', () => {
    const wrapper = shallow(
      <ConnectionStatus
        {...props}
        errors={props.errors.add('someerr')}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
