import React from 'react';
import {
  AdvanceSettingsHeader,
  Collapse,
  Panel,
} from './AdvanceSettings.style';
import Input from '../../ui/Input';
import HelperText from '../../ui/HelperText';
import { FormItem, FormItemLabel } from '../../ui/Form';

const AdvanceSettings = () => (
  <Collapse bordered={false} defaultActiveKey={['2']}>
    <Panel
      header={<AdvanceSettingsHeader>Advanced Settings</AdvanceSettingsHeader>}
      key="1"
    >
      <FormItem
        label={<FormItemLabel>Gas Price</FormItemLabel>}
        colon={false}
        help={<HelperText left="0.000001249071" right="USD" />}
      >
        <Input defaultValue={30000} type="number" />
      </FormItem>
      <FormItem label={<HelperText left="Gas Limit" />} colon={false}>
        <Input defaultValue={21000} type="number" />
      </FormItem>
    </Panel>
  </Collapse>
);

export default AdvanceSettings;
