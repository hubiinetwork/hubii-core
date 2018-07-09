import React from 'react';
import { shallow } from 'enzyme';
import ContactDeletionModal from 'components/DeletionModal';

describe('<ContactDeletionModal/>', () => {
  const contact = {
    name: 'mike',
    address: '0x3123123',
  };

  const onCancel = jest.fn();
  const onDelete = jest.fn();

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <ContactDeletionModal
        name={contact.name}
        address={contact.address}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    );
  });

  it('should render <ContactDeletionModal/> correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('when the delete button is clicked the onDelete function is run', () => {
    const button = wrapper.find('#delete');
    button.simulate('click');
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('when the cancel button is clicked the onCancel function is run', () => {
    const button = wrapper.find('#cancel');
    button.simulate('click');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
