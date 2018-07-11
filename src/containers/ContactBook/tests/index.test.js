import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import { ContactBook, mapDispatchToProps } from '../index';
import { removeContact, editContact } from '../actions';


describe('<ContactBook />', () => {
  describe('mapDispatchToProps', () => {
    describe('removeContact', () => {
      it('should call dispatch', () => {
        const contacts = [];
        const contact = {
          name: 'mike',
          address: '0x3424',
        };
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        result.removeContact(contacts, contact);
        expect(dispatch).toHaveBeenCalledWith(removeContact(contacts, contact));
      });
    });
    describe('editContact', () => {
      it('should call dispatch', () => {
        const contacts = [];
        const newContact = {
          name: 'mike',
          address: '0x3424',
        };
        const oldContact = {
          name: 'mike',
          address: '0x3424',
        };
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        result.editContact(contacts, newContact, oldContact);
        expect(dispatch).toHaveBeenCalledWith(editContact(contacts, newContact, oldContact));
      });
    });
  });

  const params = {
    contacts: fromJS([
      {
        name: 'mike',
        address: '0x3123123',
      },
      {
        name: 'joe',
        address: '0x123123123',
      },
    ]),
    removeContact: jest.fn(),
    editContact: jest.fn(),
  };

  let wrapper;
  let instance;
  beforeEach(() => {
    wrapper = shallow(
      <ContactBook
        {...params}
      />
    );
    instance = wrapper.instance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('shallow mount', () => {
    it('should correctly render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('methods in <ContactBook />', () => {
    describe('filterSearchText', () => {
      it('if type is recentFilterText should filter data based on recentFilterText', () => {
        const state = {
          recentFilterText: 'mike',
          fullFilterText: 'john',
        };
        const data = [
          {
            name: 'mike',
            address: '0x324324234',
          },
          {
            name: 'john',
            address: '0x324s14234',
          },
          {
            name: 'snow',
            address: '0x3243d4234',
          },
        ];
        const type = 'recentFilterText';
        const expectedResult = [
          {
            name: 'mike',
            address: '0x324324234',
          },
        ];
        instance.setState({ ...state });
        expect(instance.filterSearchText(data, type)).toEqual(expectedResult);
      });
      it('if type is fullFilterText should filter data based on fullFilterText', () => {
        const state = {
          recentFilterText: 'mike',
          fullFilterText: 'john',
        };
        const data = [
          {
            name: 'mike',
            address: '0x324324234',
          },
          {
            name: 'john',
            address: '0x324s14234',
          },
          {
            name: 'snow',
            address: '0x3243d4234',
          },
        ];
        const type = 'fullFilterText';
        const expectedResult = [
          {
            name: 'john',
            address: '0x324s14234',
          },
        ];
        instance.setState({ ...state });
        expect(instance.filterSearchText(data, type)).toEqual(expectedResult);
      });
      it('if type is not "recentFilterText" OR "fullFilterText", should return data unfiltered', () => {
        const state = {
          recentFilterText: 'mike',
          fullFilterText: 'john',
        };
        const data = [
          {
            name: 'mike',
            address: '0x324324234',
          },
          {
            name: 'john',
            address: '0x324s14234',
          },
          {
            name: 'snow',
            address: '0x3243d4234',
          },
        ];
        const type = '';
        instance.setState({ ...state });
        expect(instance.filterSearchText(data, type)).toEqual(data);
      });
    });
  });
});
