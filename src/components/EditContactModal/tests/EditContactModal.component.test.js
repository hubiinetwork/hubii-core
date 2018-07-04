// import React from 'react';
// import { shallow, mount, dive } from 'enzyme';
// import EditContactModals, { EditContactModal } from '../EditContactModal.component';
// import { StyledButton1, ParentDiv } from '../EditContactModal.style';
// // Import Theme Provider
// import { ThemeProvider } from 'styled-components';
// // Import Themes
// import dark from 'themes/darkTheme';


// describe('<EditContactModal/>', () => {
//   const props = {
//     name: 'mike',
//     address: '0x12312313',
//     onEdit: jest.fn(),
//     onChange: jest.fn(),
//     validateEdit: jest.fn(),
//   };
//   it('should correctly render <EditContactModal/>', () => {
//     const wrapper = shallow(
//       <EditContactModals {...props} />
//       );
//     expect(wrapper).toMatchSnapshot();
//   });

//   // not completely sure how to test this
//   describe('<EditContactModal/> function testing', () => {
//     it('on submitting the form the handleEdit function should run correctly', () => {
//       const wrapper = shallow(
//         <EditContactModals {...props} />

//         );
//       const spy = jest.spyOn(EditContactModal.prototype, 'handleEdit');
//       const button = wrapper.find(EditContactModal).dive().find(StyledButton1);
//       button.simulate('click');
//       console.log(spy);
//       expect(spy).toHaveBeenCalledTimes(1);
//       // expect(wrapper.find(EditContactModal).dive().props.onEdit).toHaveBeenCalledTimes(1);
//     });

//     it('should run validateEdit function', () => {
//       const wrapper = shallow(
//         <EditContactModals {...props} />
//       );
//       const spy = wrapper.find(EditContactModal);
//       console.log(spy);
//       // spy.validateEdit({}, 'hello', 'yo');
//       // expect(validateEdit({}, 'hello', 'yo')).toEqual(true);
//     });
//   });
// });
