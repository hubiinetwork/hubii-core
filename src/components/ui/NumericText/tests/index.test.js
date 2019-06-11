import React from 'react';
import {
  shallow,
} from 'enzyme';
import {
  intl,
} from 'jest/__mocks__/react-intl';

import { NumericText } from '../index';
import SelectableText from '../../SelectableText';

describe('<NumericText />', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = {
      intl,
    };
  });
  describe('not currency type', () => {
    describe('without maxDecimalPlaces param', () => {
      describe('when value is greater or equal to default 6 decimal places', () => {
        [
          '0.000001',
          '0.00001',
          '0.0001',
          '0.001',
          '0.01',
          '0.1',
          '1',
          '1.1',
        ].forEach((val) => {
          it(`should render the same value ${val}`, () => {
            wrapper = shallow(<NumericText
              {...props}
              value={val}
            />
            );
            expect(getInnerText(wrapper.find(SelectableText).html())).toContain(val);
          });
        });
      });
      describe('when value is less than default 6 decimal places', () => {
        [
          ['0.0000001', '1.000e-7'],
          ['0.00000001', '1.000e-8'],
          ['0.000000123456', '1.235e-7'],
        ].forEach(([val, expected]) => {
          it(`should render the exponential value ${val}`, () => {
            wrapper = shallow(<NumericText
              {...props}
              value={val}
            />
            );
            expect(getInnerText(wrapper.find(SelectableText).html())).toContain(expected);
          });
        });
      });
    });
    describe('with maxDecimalPlaces param', () => {
      describe('when maxDecimalPlaces param is 3', () => {
        [
          ['10000', '10000'],
          ['0.001', '0.001'],
          ['0.0001', '1.000e-4'],
          ['0.000000123456', '1.235e-7'],
        ].forEach(([val, expected]) => {
          it(`should render ${expected} for value ${val}`, () => {
            wrapper = shallow(<NumericText
              {...props}
              value={val}
              maxDecimalPlaces={3}
            />
            );
            expect(getInnerText(wrapper.find(SelectableText).html())).toContain(expected);
          });
        });
      });
      describe('when maxDecimalPlaces param is 20', () => {
        [
          ['10000', '10000'],
          ['0.001', '0.001'],
          ['0.0001', '0.0001'],
          ['0.000000123456', '0.000000123456'],
          ['0.00000012345678910111', '0.00000012345678910111'],
          ['0.0000000000000000000123456', '0.0000000000000000000123456'],
          ['0.00000000000000000000123456', '1.235e-21'],
        ].forEach(([val, expected]) => {
          it(`should render ${expected} for value ${val}`, () => {
            wrapper = shallow(<NumericText
              {...props}
              value={val}
              maxDecimalPlaces={20}
            />
            );
            expect(getInnerText(wrapper.find(SelectableText).html())).toContain(expected);
          });
        });
      });
    });
    describe('when value is 0', () => {
      it('should render 0', () => {
        wrapper = shallow(<NumericText
          {...props}
          value={'0'}
        />
        );
        expect(getInnerText(wrapper.find(SelectableText).html())).toEqual('0');
      });
    });
  });
  describe('currency type', () => {
    describe('with maxDecimalPlaces param', () => {
      it('should pass correct params to the #formatNumber()', () => {
        wrapper = shallow(<NumericText
          {...props}
          type={'currency'}
          value={'0.001'}
          maxDecimalPlaces={3}
        />
        );
        expect(getInnerText(wrapper.find(SelectableText).html())).toEqual('0.001 {&quot;style&quot;:&quot;currency&quot;,&quot;currency&quot;:&quot;USD&quot;,&quot;maximumFractionDigits&quot;:3}');
      });
    });
    describe('without maxDecimalPlaces param', () => {
      it('should pass correct params to the #formatNumber()', () => {
        wrapper = shallow(<NumericText
          {...props}
          type={'currency'}
          value={'0.001'}
        />
        );
        expect(getInnerText(wrapper.find(SelectableText).html())).toEqual('0.001 {&quot;style&quot;:&quot;currency&quot;,&quot;currency&quot;:&quot;USD&quot;,&quot;maximumFractionDigits&quot;:2}');
      });
    });
  });
});

function getInnerText(str) {
  const reg = /<span[^>]*>([^<]+)<\/span>/g;
  return reg.exec(str)[1];
}
