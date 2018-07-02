import React from 'react';
import { shallow } from 'enzyme';
import ContactList from 'components/ContactList';

describe('<ContactDeletionModal/>', () => {
  const contact = [
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

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <ContactList
        data={contact}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  });

  it('should render <ContactDeletionModal/> correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('Modal functionality', () => {

  });
});
