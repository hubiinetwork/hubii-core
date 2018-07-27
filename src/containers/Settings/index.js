import { Select } from 'antd';
import * as React from 'react';
// import PropTypes from 'prop-types';
// import { compose } from 'redux';
// import { connect } from 'react-redux';
import Toggler from 'components/Toggler';

import {
  Wrapper,
  StyledButton,
  TopHeader,
  Heading,
  StyledSwitch,
  RedButton,
  SubtitleText,
  StyledHeader,
  StyledSelect,
  Segment,
  Container,
} from './index.style';

const Option = Select.Option;

const titleTabs = [
  {
    title: 'Simple',
  },
  {
    title: 'Advanced',
  },
];

export const Settings = () => (
  <Wrapper>
    <TopHeader>
      <Heading>Settings</Heading>
      <StyledSwitch disabled defaultChecked onChange={() => {}} />
    </TopHeader>
    <Container>
      <Segment>
        <StyledHeader >
          Language
        </StyledHeader>
        <StyledSelect defaultValue="English" disabled onChange={() => {}}>
          <Option value="English">English</Option>
          <Option value="Japanese">Japanese</Option>
          <Option value="Mandarin" disabled>Mandarin</Option>
          <Option value="Russian">Russian</Option>
        </StyledSelect>
      </Segment>
      <Segment>
        <StyledHeader >
          Fiat Currency
        </StyledHeader>
        <StyledSelect defaultValue="US" disabled onChange={() => {}}>
          <Option value="US">US</Option>
        </StyledSelect>
      </Segment>
      <Segment>
        <StyledHeader>
          User Interface
        </StyledHeader>
        <Toggler
          titleTabs={titleTabs}
          showSearch
          onTabChange={() => {}}
        />
      </Segment>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2rem' }}>
        <StyledButton
          type="primary"
          disabled
        >
          Register for Striim Airdrop
        </StyledButton>
        <StyledButton
          type="primary"
          disabled
        >
          Manage Hubii Core Password
        </StyledButton>
        <StyledButton
          type="primary"
          disabled
        >
          Multi Device Autosync
        </StyledButton>
        <StyledButton
          type="primary"
          disabled
        >
          Backup Local Data
        </StyledButton>
      </div>
      <SubtitleText>
        Last Backup 03-02-2018
      </SubtitleText>
      <div>
        <RedButton
          type="primary"
          disabled
        >
          Delete All Local Data
        </RedButton>
      </div>
      <SubtitleText>
        Warning! This cannot be undone, procceed with caution.
      </SubtitleText>
    </Container>
  </Wrapper>
    );

Settings.propTypes = {

};

export default Settings;
