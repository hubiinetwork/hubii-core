import { Row, Col } from 'antd';
import * as React from 'react';
import styled from 'styled-components';
import Contact from '../../components/ContactList';
import ContactHeader from '../../components/ContactHeader';
import { allData, data } from './contactData';

const StyledCol = styled(Col)`
  margin-top: 20px;
  min-height: 500px;
  border-right: 1px solid ${({ theme }) => theme.palette.primary4};
`;

export default class ContactBook extends React.PureComponent {
  render() {
    return (
      <Row>
        <StyledCol xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
          <ContactHeader title={'Recent Contacts'} />
          <Contact data={allData} />
        </StyledCol>
        <StyledCol xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
          <ContactHeader showSearch={true} />
          <Contact data={data} />
        </StyledCol>
        <StyledCol xs={24} sm={24} md={24} lg={24} xl={8} xxl={8} />
      </Row>
    );
  }
}
