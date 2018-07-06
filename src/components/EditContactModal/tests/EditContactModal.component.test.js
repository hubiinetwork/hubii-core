import React from 'react';
import { shallow } from 'enzyme';
import EditContactModalForm, { EditContactModal } from '../EditContactModal.component';

describe('<EditContactModal/>', () => {
  const props = {
    name: 'mike',
    address: '0x12312313',
    onEdit: jest.fn(),
    onChange: jest.fn(),
    validateEdit: jest.fn(),

  };
  it('should correctly render <EditContactModal/>', () => {
    const wrapper = shallow(
      <EditContactModalForm {...props} />
      );
    const component = wrapper.find(EditContactModal).dive();
    expect(component).toMatchSnapshot();
  });
});
