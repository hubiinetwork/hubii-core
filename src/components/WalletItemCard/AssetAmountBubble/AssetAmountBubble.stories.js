import { withKnobs } from "@storybook/addon-knobs/react";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import AssetAmountBubble from "./";

const stories = storiesOf("AssetAmountBubble Component", module);

stories.addDecorator(withKnobs);

stories.add("Simple AssetAmountBubble", () => {
  return <AssetAmountBubble name="HBT" amount={12.32001} />;
});
