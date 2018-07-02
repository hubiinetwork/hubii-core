// import React from 'react';
// import { shallow, wrap } from 'enzyme';

// import DeleteContactModal from '../index';

// describe('<DeleteContactModal />', () => {
//   const contact = [
//     {
//       name: 'mike',
//       address: '0xdddddde3eb1969b608ca9334b5baf8e3760bb16a',
//     },
//     {
//       name: 'jordan',
//       address: '0xdddddde3eb1969b608ca9334b5baf8e376016a',
//     },
//   ];

//   const onDelete = jest.fn();
//   it('should render correctly', () => {
//     const wrapper = shallow(<DeleteContactModal contact={contact} onDelete={onDelete} />);
//     expect(wrapper).toMatchSnapshot();
//   });

//   // it('should respond to selectName event and change the state', () => {
//   //   const initialState = {
//   //     currContactAddress: '',
//   //     currContactName: '',
//   //     initialDisable: true,
//   //   };
//   //   wrapper.setState({});
//   //   const wrapper = shallow(<DeleteContactModal contact={contact} onDelete={onDelete} />);
//   //   expect(wrapper.dive().instance().selectName().simulateClick());
//   // });
// });
