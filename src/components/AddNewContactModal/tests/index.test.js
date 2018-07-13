import React from 'react';
import { shallow } from 'enzyme';
import { AddNewContactModal } from '../AddNewContactModal.component';

describe('AddNewContactModal', () => {
  describe('shallow mount', () => {
    let dom;
    let params;
    describe('validateField', () => {
      beforeEach(() => {
        params = {
          form: { getFieldDecorator: () => jest.fn() },
          contacts: [],
        };
      });
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
        const checkType = 'inuse';
        instance.validateField(rule, checkType, '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a', callbackSpy);
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
        const checkType = 'invalid';
        instance.validateField(rule, checkType, '123', callbackSpy);
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
        const checkType = 'invalid';
        instance.validateField(rule, checkType, '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a', callbackSpy);
        expect(callbackSpy).toBeCalledWith();
      });
    });
  });
});
