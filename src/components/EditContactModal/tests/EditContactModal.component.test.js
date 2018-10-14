import React from 'react';
import { shallow } from 'enzyme';
import { EditContactModal } from '../EditContactModal.component';
import { intl } from '../../../../__mocks__/react-intl';

describe('EditContactModal', () => {
  describe('shallow mount', () => {
    let dom;
    let props;
    beforeEach(() => {
      props = {
        form: {
          getFieldDecorator: () => jest.fn(),
          validateFields: jest.fn(),
        },
        contacts: [],
        confirmText: 'Add',
        intl,
      };
    });
    describe('validateField', () => {
      it('already has the address but the old address is the same as the edited', () => {
        const contacts = [{ address: '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a' }];
        dom = shallow(
          <EditContactModal
            {...props}
            contacts={contacts}
          />
        );
        const instance = dom.instance();
        const callbackSpy = jest.fn();
        const rule = { field: 'address' };
        instance.setState({
          oldAddress: '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a',
        });
        instance.validateAddressInUse(rule, '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a', callbackSpy);
        expect(callbackSpy).toBeCalled();
      });
      it('already has the address and the old address is not the same as the edited', () => {
        const contacts = [{ address: '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a' }];
        dom = shallow(
          <EditContactModal
            {...props}
            contacts={contacts}
          />
        );
        const instance = dom.instance();
        const callbackSpy = jest.fn();
        const rule = { field: 'address' };
        instance.setState({
          oldAddress: '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f13a',
        });
        instance.validateAddressInUse(rule, '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a', callbackSpy);
        expect(callbackSpy).toBeCalledWith('contact_address_exist_error');
      });
      it('address is invalid', () => {
        dom = shallow(
          <EditContactModal
            {...props}
          />
        );
        const instance = dom.instance();
        const callbackSpy = jest.fn();
        const rule = { field: 'address' };
        instance.validateInvalid(rule, '123', callbackSpy);
        expect(callbackSpy).toBeCalledWith('invalid_address');
      });
      it('valid address', () => {
        dom = shallow(
          <EditContactModal
            {...props}
          />
        );
        const instance = dom.instance();
        const callbackSpy = jest.fn();
        const rule = { field: 'address' };
        instance.validateInvalid(rule, '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a', callbackSpy);
        expect(callbackSpy).toBeCalledWith();
      });
    });
    describe('handleEdit', () => {
      const e = {
        preventDefault: jest.fn(),
      };

      it('should run the propform validateFields function', () => {
        dom = shallow(
          <EditContactModal
            {...props}
          />
        );
        const instance = dom.instance();
        instance.handleEdit(e);
        expect(e.preventDefault).toHaveBeenCalledTimes(1);
        expect(props.form.validateFields).toHaveBeenCalledTimes(1);
      });
    });
  });
});
