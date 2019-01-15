import React from 'react';
import sinon from 'sinon';
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
    let onChangeSpy;
    describe('when gasStatistics available', () => {
      beforeEach(() => {
        onChangeSpy = sinon.spy();
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
      });
      it('should disable the gasprice inputs', () => {
        expect(gasPriceInput.props().disabled).toEqual(true);
      });
      ['safeLow', 'average', 'fast'].forEach((speed) => {
        it(`when defaultOption set to ${speed}, should correctly return the fees/gasLimit/gasPrice`, () => {
          const instance = wrapper.instance();
          instance.handleOptionChange(speed);
          const suggestedGasPrice = props.gasStatistics[speed] / 10;
          const fee = new BigNumber(suggestedGasPrice).times(new BigNumber(10).pow(9)).times(props.defaultGasLimit);

          expect(onChangeSpy.getCall(1).args[0]).toEqual(fee);
          expect(onChangeSpy.getCall(1).args[1]).toEqual(new BigNumber(props.defaultGasLimit));
          expect(onChangeSpy.getCall(1).args[2]).toEqual(new BigNumber(suggestedGasPrice));
        });
      });
    });
    describe('when gasStatistics not available', () => {
      beforeEach(() => {
        onChangeSpy = sinon.spy();
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
        const fee = new BigNumber(props.defaultGasPrice).times(new BigNumber(10).pow(9)).times(props.defaultGasLimit);
        expect(onChangeSpy.getCall(0).args[0]).toEqual(fee);
        expect(onChangeSpy.getCall(0).args[1]).toEqual(new BigNumber(props.defaultGasLimit));
        expect(onChangeSpy.getCall(0).args[2]).toEqual(new BigNumber(props.defaultGasPrice));
      });
    });
  });
  describe('defaultOption set to manual ', () => {
    let wrapper;
    let gasLimitInput;
    let gasPriceInput;
    let onChangeSpy;
    beforeEach(() => {
      onChangeSpy = sinon.spy();
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
    it('when defaultOption set to manual, should correctly return default fees/gasLimit/gasPrice', () => {
      const instance = wrapper.instance();
      instance.handleOptionChange('manual');
      const fee = new BigNumber(props.defaultGasPrice).times(new BigNumber(10).pow(9)).times(props.defaultGasLimit);

      expect(onChangeSpy.getCall(0).args[0]).toEqual(fee);
      expect(onChangeSpy.getCall(0).args[1]).toEqual(new BigNumber(props.defaultGasLimit));
      expect(onChangeSpy.getCall(0).args[2]).toEqual(new BigNumber(props.defaultGasPrice));
    });
    it('gas select option should set to manual', () => {
      expect(wrapper.find('.gas-options').props().defaultValue).toEqual('manual');
    });
    it('should have default input values', () => {
      expect(gasLimitInput.props().defaultValue).toEqual(props.defaultGasLimit.toString());
      expect(gasPriceInput.props().defaultValue).toEqual(props.defaultGasPrice.toString());
    });
    it('should allow edit the gasPrice inputs', () => {
      expect(gasPriceInput.props().disabled).toEqual(false);
    });
    it('#onChange should correctly return fee/gasLimit when gasLimitInput is changed', () => {
      const gasLimit = new BigNumber('1');
      const fee = new BigNumber(props.defaultGasPrice).times(new BigNumber(10).pow(9)).times(gasLimit);

      gasLimitInput.simulate('change', {
        target: {
          value: gasLimit.toString(),
        },
      });
      expect(onChangeSpy.getCall(1).args[0]).toEqual(fee);
      expect(onChangeSpy.getCall(1).args[1]).toEqual(gasLimit);
      expect(onChangeSpy.getCall(1).args[2]).toEqual(new BigNumber(props.defaultGasPrice));
    });
    it('#onChange should correctly return fee/gasPrice when gasPriceInput is changed', () => {
      const gasPrice = new BigNumber('1');
      const fee = gasPrice.times(new BigNumber(10).pow(9)).times(props.defaultGasLimit);

      gasPriceInput.simulate('change', {
        target: {
          value: gasPrice.toString(),
        },
      });
      expect(onChangeSpy.getCall(1).args[0]).toEqual(fee);
      expect(onChangeSpy.getCall(1).args[1]).toEqual(new BigNumber(props.defaultGasLimit));
      expect(onChangeSpy.getCall(1).args[2]).toEqual(gasPrice);
    });
    it('#onChange should correctly return fee/gasPrice when both gasLimitInput and gasPriceInput are changed', () => {
      const gasPrice = new BigNumber('1');
      const gasLimit = new BigNumber('2');
      const fee = gasPrice.times(new BigNumber(10).pow(9)).times(gasLimit);

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
      expect(onChangeSpy.getCall(2).args[0]).toEqual(fee);
      expect(onChangeSpy.getCall(2).args[1]).toEqual(new BigNumber(gasLimit));
      expect(onChangeSpy.getCall(2).args[2]).toEqual(gasPrice);
    });
  });
});
