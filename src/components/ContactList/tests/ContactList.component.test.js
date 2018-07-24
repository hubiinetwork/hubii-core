import React from 'react';
import { shallow } from 'enzyme';
import ContactList from 'components/ContactList';
import DeletionModal from 'components/DeletionModal';
import EditContactModal from 'components/EditContactModal';

describe('<ContactList/>', () => {
  const contacts = [
    {
      name: 'mike',
      address: '0x3123123',
    },
    {
      name: 'joe',
      address: '0x123123123',
    },
  ];
  const onDelete = jest.fn();
  const onEdit = jest.fn();

  describe('shallow mount', () => {
    it('should render <ContactList/> with data', () => {
      const shallowWrapper = shallow(
        <ContactList
          data={contacts}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
      expect(shallowWrapper).toMatchSnapshot();
    });

    it('should render <ContactList/> without data', () => {
      const shallowWrapper = shallow(
        <ContactList
          data={[]}
          onEdit={onEdit}
          onDelete={onDelete}
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
          data={contacts}
          onEdit={onEdit}
          onDelete={onDelete}
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
        expect(contactList.state.name).toEqual(item.name);
        expect(contactList.state.address).toEqual(item.address);
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
