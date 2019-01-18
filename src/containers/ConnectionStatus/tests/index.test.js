import React from 'react';
import { shallow } from 'enzyme';
import { Set } from 'immutable';

import { ConnectionStatus } from '../index';

describe('<ConnectionStatus />', () => {
  let props;
  beforeEach(() => {
    props = {
      currentNetwork: { provider: { _network: { chainId: 1 } } },
      errors: new Set(),
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
