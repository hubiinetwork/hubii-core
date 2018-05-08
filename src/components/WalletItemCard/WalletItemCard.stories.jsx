import { withKnobs } from "@storybook/addon-knobs/react";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import WalletItemCard from "./";

const stories = storiesOf("WalletItemCard Component", module);

stories.addDecorator(withKnobs);

stories.add("Simple WalletItemCard", () => {
  return (
    <WalletItemCard
      name={"Wallet 123"}
      totalBalance={100.231}
      primaryAddress={"0xda1736e3eb1969b608ca9334b5baf8e3760bb16a"}
      type="Hubii Wallet"
      assets={[
        {
          name: "ETH",
          amount: 0.21
        },
        {
          name: "HBT",
          amount: 23102
        }
      ]}
    />
  );
});
