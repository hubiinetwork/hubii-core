import { Icon, Select } from 'antd';
import * as React from 'react';
// import PropTypes from 'prop-types';
// import { compose } from 'redux';
// import { connect } from 'react-redux';
import Toggler from 'components/Toggler';

import {
  Wrapper,
  TabsLayout,
  // StyledButton,
  WalletsTabHeader,
  Heading,
  StyledSwitch,
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

export const WalletManager = () => (
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
        <div style={{ fontSize: '14px', marginBottom: '8px' }} >
          hello there
        </div>
        <Select defaultValue="lucy" style={{ width: '330px' }} onChange={() => console.log('hello')}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="disabled" disabled>Disabled</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
      </div>
      <div style={{ marginTop: '30px' }}>
        <div style={{ fontSize: '14px', marginBottom: '8px' }} >
          hello there
        </div>
        <Select defaultValue="lucy" style={{ width: '330px' }} onChange={() => console.log('hello')}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="disabled" disabled>Disabled</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <div style={{ fontSize: '14px', marginBottom: '8px' }} >
          hello there
        </div>
        <Toggler
          titleTabs={titleTabs}
          showSearch
          onTabChange={() => {
            console.log('Tab changed');
          }}
        />
      </div>
    </div>
  </Wrapper>
    );


WalletManager.propTypes = {

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

export default WalletManager;
