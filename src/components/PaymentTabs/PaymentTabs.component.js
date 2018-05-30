import StriimTabs, { TabPane } from '../ui/StriimTabs';
import React from 'react';

function callback(key) {
  console.log(key);
}

const PaymentTabs = props => {
  return (
    <StriimTabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab="Payments" key="1" style={{ color: 'white' }}>
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="Topup" key="2" style={{ color: 'white' }}>
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="Withdrawal" key="3" style={{ color: 'white' }}>
        Content of Tab Pane 3
      </TabPane>
      <TabPane tab="Swap Currencies" key="4" style={{ color: 'white' }}>
        Content of Tab Pane 4
      </TabPane>
      <TabPane tab="Savings Account" key="5" style={{ color: 'white' }}>
        Content of Tab Pane 5
      </TabPane>
      <TabPane tab="Advanced" key="6" style={{ color: 'white' }}>
        Content of Tab Pane 6
      </TabPane>
    </StriimTabs>
  );
};

export default PaymentTabs;
