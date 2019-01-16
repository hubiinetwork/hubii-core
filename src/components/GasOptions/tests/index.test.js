import React from 'react';
import BigNumber from 'bignumber.js';
import {
  shallow,
} from 'enzyme';
import {
  intl,
} from 'jest/__mocks__/react-intl';

import GasOptions from '../index';

describe('<GasOptions />', () => {
  let props;
  beforeEach(() => {
    props = {
      intl,
      gasStatistics: {
        safeLow: 19.0,
        safeLowWait: 22.1,
        fast: 100.0,
        fastWait: 0.7,
        fastest: 250.0,
        fastestWait: 0.5,
        average: 41.0,
        avgWait: 1.6,
        block_time: 13.98421052631579,
        speed: 0.8085666916661166,
        blockNum: 7068199,
      },
      defaultGasLimit: 800000,
      defaultGasPrice: 10,
    };
  });
  describe('defaultOption does not set to manual', () => {
    let wrapper;
    let gasPriceInput;
    let gasLimitInput;
    let onChangeSpy;
    describe('when gasStatistics available', () => {
      beforeEach(() => {
        onChangeSpy = jest.fn();
        wrapper = shallow(<GasOptions
          {...props
          }
          defaultOption="average"
          onChange={
            onChangeSpy
          }
        />
        );
        gasPriceInput = wrapper.find('.gas-price-input');
        gasLimitInput = wrapper.find('.gas-limit-input');
      });
      it('should disable the gasprice inputs', () => {
        expect(gasPriceInput).toHaveLength(0);
        expect(gasLimitInput).toHaveLength(0);
      });
      ['safeLow', 'average', 'fast'].forEach((speed) => {
        it(`when defaultOption set to ${speed}, should correctly update states`, () => {
          const instance = wrapper.instance();
          instance.handleOptionChange(speed);
          const state = wrapper.state();
          expect(state.gasPriceGwei).toEqual(props.gasStatistics[speed] / 10);
          expect(state.gasPriceGweiInput).toEqual((props.gasStatistics[speed] / 10).toString());
          expect(state.option).toEqual(speed);
        });
      });
    });
    describe('when gasStatistics not available', () => {
      beforeEach(() => {
        onChangeSpy = jest.fn();
        wrapper = shallow(<GasOptions
          {...props
          }
          gasStatistics={null}
          defaultOption="average"
          onChange={
            onChangeSpy
          }
        />
        );
      });
      it('should default to manual after mount', () => {
        expect(wrapper.find('.gas-options').props().defaultValue).toEqual('manual');
        expect(wrapper.find('Option')).toHaveLength(1);
        expect(wrapper.find('Option').props().value).toEqual('manual');
      });
      it('should default gas limit/price to manual', () => {
        const state = wrapper.state();
        expect(state.gasPriceGwei).toEqual(props.defaultGasPrice);
        expect(state.gasPriceGweiInput).toEqual(props.defaultGasPrice.toString());
        expect(state.gasLimit).toEqual(props.defaultGasLimit);
        expect(state.gasLimitInput).toEqual(props.defaultGasLimit.toString());
      });
    });
  });
  describe('defaultOption set to manual ', () => {
    let wrapper;
    let gasLimitInput;
    let gasPriceInput;
    let onChangeSpy;
    beforeEach(() => {
      onChangeSpy = jest.fn();
      wrapper = shallow(<GasOptions
        {...props}
        defaultOption="manual"
        onChange={
          onChangeSpy
        }
      />
      );
      gasLimitInput = wrapper.find('.gas-limit-input');
      gasPriceInput = wrapper.find('.gas-price-input');
    });
    it('when defaultOption set to manual, should correctly update states', () => {
      const instance = wrapper.instance();
      instance.handleOptionChange('manual');

      const state = wrapper.state();
      expect(state.gasPriceGwei).toEqual(props.defaultGasPrice);
      expect(state.gasPriceGweiInput).toEqual(props.defaultGasPrice.toString());
      expect(state.gasLimit).toEqual(props.defaultGasLimit);
      expect(state.gasLimitInput).toEqual(props.defaultGasLimit.toString());
    });
    it('gas select option should set to manual', () => {
      expect(wrapper.find('.gas-options').props().defaultValue).toEqual('manual');
    });
    it('should allow edit the gasPrice/Limit inputs', () => {
      expect(gasLimitInput).toHaveLength(1);
      expect(gasPriceInput).toHaveLength(1);
    });
    it('should have default input values', () => {
      expect(gasLimitInput.props().defaultValue).toEqual(props.defaultGasLimit.toString());
      expect(gasPriceInput.props().defaultValue).toEqual(props.defaultGasPrice.toString());
    });
    it('#onChange should correctly update states when gasLimitInput is changed', () => {
      const gasLimit = new BigNumber('1');

      gasLimitInput.simulate('change', {
        target: {
          value: gasLimit.toString(),
        },
      });
      const state = wrapper.state();
      expect(state.gasLimit).toEqual(gasLimit.toNumber());
      expect(state.gasLimitInput).toEqual(gasLimit.toString());
    });
    it('#onChange should correctly update states when gasPriceInput is changed', () => {
      const gasPrice = new BigNumber('1');

      gasPriceInput.simulate('change', {
        target: {
          value: gasPrice.toString(),
        },
      });

      const state = wrapper.state();
      expect(state.gasPriceGwei).toEqual(gasPrice);
      expect(state.gasPriceGweiInput).toEqual(gasPrice.toString());
    });
    it('#onChange should correctlyupdate states when both gasLimitInput and gasPriceInput are changed', () => {
      const gasPrice = new BigNumber('1');
      const gasLimit = new BigNumber('2');

      gasPriceInput.simulate('change', {
        target: {
          value: gasPrice.toString(),
        },
      });
      gasLimitInput.simulate('change', {
        target: {
          value: gasLimit.toString(),
        },
      });
      const state = wrapper.state();
      expect(state.gasLimit).toEqual(gasLimit.toNumber());
      expect(state.gasLimitInput).toEqual(gasLimit.toString());
      expect(state.gasPriceGwei).toEqual(gasPrice);
      expect(state.gasPriceGweiInput).toEqual(gasPrice.toString());
    });
  });
  describe('#onChange', () => {
    let onChangeSpy;
    let wrapper;
    beforeEach(() => {
      onChangeSpy = jest.fn();
      wrapper = shallow(<GasOptions
        {...props}
        defaultOption="manual"
        onChange={
          onChangeSpy
        }
      />
      );
    });
    it('should trigger onChange callback with correct args', () => {
      const gasLimit = 1;
      const gasPriceGwei = 2;
      wrapper.setState({ gasLimit, gasPriceGwei });
      const fee = new BigNumber(gasLimit).times(new BigNumber(gasPriceGwei).times(new BigNumber(10).pow(9)));
      expect(onChangeSpy.mock.calls[0][0]).toEqual(fee);
      expect(onChangeSpy.mock.calls[0][1]).toEqual(new BigNumber(gasLimit));
      expect(onChangeSpy.mock.calls[0][2]).toEqual(new BigNumber(gasPriceGwei));
    });
  });
});
