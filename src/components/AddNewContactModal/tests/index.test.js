import React from 'react';
import { shallow } from 'enzyme';
import { AddNewContactModal } from '../AddNewContactModal.component';

describe('AddNewContactModal', () => {
  describe('shallow mount', () => {
    let dom;
    let params;
    beforeEach(() => {
      params = {
        form: {
          getFieldDecorator: () => jest.fn(),
          validateFields: jest.fn(),
        },
        contacts: [],
      };
    });
    describe('handleSubmit', () => {
      const e = {
        preventDefault: jest.fn(),
      };

      it('should run the propform validateFields function', () => {
        dom = shallow(
          <AddNewContactModal
            {...params}
          />
        );
        const instance = dom.instance();
        instance.handleSubmit(e);
        expect(e.preventDefault).toHaveBeenCalledTimes(1);
        expect(params.form.validateFields).toHaveBeenCalledTimes(1);
      });
    });
    describe('validateField', () => {
      it('already has the address', () => {
        const contacts = [{ address: '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a' }];
        dom = shallow(
          <AddNewContactModal
            {...params}
            contacts={contacts}
          />
        );
        const instance = dom.instance();
        const callbackSpy = jest.fn();
        const rule = { field: 'address' };
        instance.validateInUse(rule, '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a', callbackSpy);
        expect(callbackSpy).toBeCalledWith('You have already saved this address');
      });
      it('address is invalid', () => {
        dom = shallow(
          <AddNewContactModal
            {...params}
          />
        );
        const instance = dom.instance();
        const callbackSpy = jest.fn();
        const rule = { field: 'address' };
        instance.validateInvalid(rule, '123', callbackSpy);
        expect(callbackSpy).toBeCalledWith('invalid Address');
      });
      it('valid address', () => {
        dom = shallow(
          <AddNewContactModal
            {...params}
          />
        );
        const instance = dom.instance();
        const callbackSpy = jest.fn();
        const rule = { field: 'address' };
        instance.validateInvalid(rule, '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a', callbackSpy);
        expect(callbackSpy).toBeCalledWith();
      });
    });
  });
});
