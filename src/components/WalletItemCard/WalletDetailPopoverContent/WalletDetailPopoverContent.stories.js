import { withKnobs } from "@storybook/addon-knobs/react";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import WalletDetailPopoverContent from "./";

const stories = storiesOf("WalletDetailPopoverContent Component", module);

stories.addDecorator(withKnobs);

stories.add("Simple WalletDetailPopoverContent", () => {
  return (
    <WalletDetailPopoverContent
      address="0xae1736e3eb1969b608ca9334b5baf8e3760bb16a"
      type="Hubii Wallet"
    />
  );
});
