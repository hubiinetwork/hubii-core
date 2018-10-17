import React from 'react';
import { shallow } from 'enzyme';
import DeletionModal from 'components/DeletionModal';
import { intl } from '../../../../__mocks__/react-intl';

describe('<ContactDeletionModal/>', () => {
  const contact = {
    name: 'mike',
    address: '0x3123123',
  };
  const type = 'wallet';
  const onCancel = jest.fn();
  const onDelete = jest.fn();

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <DeletionModal
        name={contact.name}
        address={contact.address}
        onCancel={onCancel}
        onDelete={onDelete}
        type={type}
        intl={intl}
      />
    );
  });

  it('should render <DeletionModal/> correctly', () => {
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
