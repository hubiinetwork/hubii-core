import React from 'react';
import { shallow } from 'enzyme';
import ContactList from 'components/ContactList';
import DeletionModal from 'components/DeletionModal';
import EditContactModal from 'components/EditContactModal';
import { intl } from '../../../../__mocks__/react-intl';

describe('<ContactList/>', () => {
  const props = {
    data: [
      {
        name: 'mike',
        address: '0x3123123',
      },
      {
        name: 'joe',
        address: '0x123123123',
      },
    ],
    empty: false,
    onDelete: jest.fn(),
    onEdit: jest.fn(),
    intl,
  };

  describe('shallow mount', () => {
    it('should render <ContactList/> with data', () => {
      const shallowWrapper = shallow(
        <ContactList
          {...props}
        />
      );
      expect(shallowWrapper).toMatchSnapshot();
    });

    it('should render <ContactList/> when empty', () => {
      const shallowWrapper = shallow(
        <ContactList
          {...props}
          empty
        />
      );
      expect(shallowWrapper).toMatchSnapshot();
    });

    it('should render with custom message', () => {
      const shallowWrapper = shallow(
        <ContactList
          {...props}
          message="custom message"
        />
      );
      expect(shallowWrapper).toMatchSnapshot();
    });

    it('should render <ContactList/> without data', () => {
      const shallowWrapper = shallow(
        <ContactList
          {...props}
          data={[]}
        />
      );
      expect(shallowWrapper).toMatchSnapshot();
    });
  });

  describe('Modal functionality', () => {
    let wrapper;
    let contactList;
    beforeEach(() => {
      wrapper = shallow(
        <ContactList
          {...props}
        />
      );
      contactList = wrapper.instance();
    });
    describe('showModal functionality', () => {
      it('should execute the showModal function and change the state', () => {
        const item = {
          name: 'mike',
          address: '0x1231231',
        };
        const modalType = 'edit';
        contactList.showModal(item, modalType);
        expect(contactList.state.oldName).toEqual(item.name);
        expect(contactList.state.oldAddress).toEqual(item.address);
        expect(contactList.state.modalType).toEqual(modalType);
        expect(contactList.state.modalVisibility).toEqual(true);
      });

      it('when the modalType is delete <ContactDeletionModal/> should be rendered', () => {
        const modalType = 'delete';
        wrapper.setState({ modalType });
        expect(wrapper.find(DeletionModal).length).toEqual(1);
      });

      it('when the modalType is anything else <EditContactModal/> should be rendered', () => {
        const modalType = '';
        wrapper.setState({ modalType });
        expect(wrapper.find(EditContactModal).length).toEqual(1);
      });
    });

    it('should execute the handleCancel function', () => {
      contactList.handleCancel();
      expect(contactList.state.modalVisibility).toBe(false);
    });

    it('should execute the handleDelete function', () => {
      contactList.handleDelete();
      expect(contactList.state.modalVisibility).toBe(false);
      expect(contactList.props.onDelete).toHaveBeenCalledTimes(1);
    });

    it('should execute the onChange function', () => {
      const input = 'mike';
      const type = 'address';
      contactList.onChange(input, type);
      expect(contactList.state[type]).toEqual(input);
    });

    it('should execute the showNotification function', () => {
      const showNotifiction = jest.spyOn(contactList, 'showNotification');
      contactList.showNotification();
      expect(showNotifiction).toHaveBeenCalledTimes(1);
    });
  });
});
