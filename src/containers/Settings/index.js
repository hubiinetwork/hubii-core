import { Icon, Select } from 'antd';
import * as React from 'react';
// import PropTypes from 'prop-types';
// import { compose } from 'redux';
// import { connect } from 'react-redux';
import Toggler from 'components/Toggler';

import {
  Wrapper,
  TabsLayout,
  StyledButton,
  WalletsTabHeader,
  Heading,
  StyledSwitch,
  RedButton,
  SubtitleText,
  StyledHeader,
  StyledSelect,
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
    <TabsLayout>
      <WalletsTabHeader>
        <Heading>Settings</Heading>
        <Icon type="aliwangwang" style={{ marginLeft: 'auto' }} />
        <StyledSwitch defaultChecked onChange={() => console.log('hello')} />
        <Icon type="meh-o" />
      </WalletsTabHeader>
    </TabsLayout>
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ marginTop: '30px' }}>
        <StyledHeader >
          Language
        </StyledHeader>
        <StyledSelect defaultValue="lucy" style={{ width: '330px' }} onChange={() => console.log('hello')}>
          <Option value="jack"><Icon type="phone" />Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="disabled" disabled>Disabled</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </StyledSelect>
      </div>
      <div style={{ marginTop: '30px' }}>
        <StyledHeader >
          Fiat Currency
        </StyledHeader>
        <Select defaultValue="lucy" style={{ width: '330px' }} onChange={() => console.log('hello')}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="disabled" disabled>Disabled</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <StyledHeader>
          User Interface
        </StyledHeader>
        <Toggler
          titleTabs={titleTabs}
          showSearch
          onTabChange={() => {
            console.log('Tab changed');
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2rem' }}>
        <StyledButton
          type="primary"
        >
          Register for Striim Airdrop
        </StyledButton>
        <StyledButton
          type="primary"
        >
          Manage Hubii Core Password
        </StyledButton>
        <StyledButton
          type="primary"
        >
          Multi Device Autosync
        </StyledButton>
        <StyledButton
          type="primary"
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
        >
          Delete All Local Data
        </RedButton>
      </div>
      <SubtitleText>
        Warning! This cannot be undone, procceed with caution.
      </SubtitleText>

    </div>
  </Wrapper>
    );

Settings.propTypes = {

};


// export function mapDispatchToProps(dispatch) {
//   return {
//     saveLedgerAddress: (...args) => dispatch(saveLedgerAddress(...args)),
//     createWalletFromMnemonic: (...args) => dispatch(createWalletFromMnemonic(...args)),
//     createWalletFromPrivateKey: (...args) => dispatch(createWalletFromPrivateKey(...args)),
//     createContact: (...args) => dispatch(createContact(...args)),
//   };
// }

// const withConnect = connect(mapStateToProps, mapDispatchToProps);

// export default compose(
//   withConnect,
// )(WalletManager);

export default Settings;
