import { withKnobs } from "@storybook/addon-knobs/react";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import AdvanceSettings from "../AdvanceSettings";

const stories = storiesOf("AdvanceSettings", module);

stories.addDecorator(withKnobs);

stories.add("AdvanceSettings", () => {
  return <AdvanceSettings />;
});
