import React from 'react';
import { shallow } from 'enzyme';
import { EditContactModal } from '../EditContactModal.component';

describe('EditContactModal', () => {
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
    describe('validateField', () => {
      it('already has the address but the old address is the same as the edited', () => {
        const contacts = [{ address: '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a' }];
        dom = shallow(
          <EditContactModal
            {...params}
            contacts={contacts}
          />
        );
        const instance = dom.instance();
        const callbackSpy = jest.fn();
        const rule = { field: 'address' };
        instance.setState({
          oldAddress: '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a',
        });
        instance.validateInUse(rule, '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a', callbackSpy);
        expect(callbackSpy).toBeCalled();
      });
      it('already has the address and the old address is not the same as the edited', () => {
        const contacts = [{ address: '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a' }];
        dom = shallow(
          <EditContactModal
            {...params}
            contacts={contacts}
          />
        );
        const instance = dom.instance();
        const callbackSpy = jest.fn();
        const rule = { field: 'address' };
        instance.setState({
          oldAddress: '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f13a',
        });
        instance.validateInUse(rule, '0x994C3De8Cc5bc781183205A3dD6E175bE1E6f14a', callbackSpy);
        expect(callbackSpy).toBeCalledWith('You have already saved this address');
      });
      it('address is invalid', () => {
        dom = shallow(
          <EditContactModal
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
          <EditContactModal
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
    describe('componentWillMount', () => {
      const contact = {
        name: 'mike',
        address: '0x12312312sad23',
      };
      it('should set the oldAddress and oldName on mount', () => {
        dom = shallow(
          <EditContactModal
            {...params}
            {...contact}
          />
        );
        const instance = dom.instance();
        instance.componentWillMount();
        expect(instance.state.oldAddress).toEqual(contact.address);
        expect(instance.state.oldName).toEqual(contact.name);
      });
    });
    describe('handleEdit', () => {
      const e = {
        preventDefault: jest.fn(),
      };

      it('should run the propform validateFields function', () => {
        dom = shallow(
          <EditContactModal
            {...params}
          />
        );
        const instance = dom.instance();
        instance.handleEdit(e);
        expect(e.preventDefault).toHaveBeenCalledTimes(1);
        expect(params.form.validateFields).toHaveBeenCalledTimes(1);
      });
    });
  });
});
