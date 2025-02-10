import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Status from "./Status";

export default {
  title: "Components/Status",
  component: Status,
} as Meta<typeof Status>;

const Template: StoryFn<typeof Status> = (args) => <Status {...args} />;

export const Active = Template.bind({});
Active.args = {
  status: "פעיל",
};

export const Inactive = Template.bind({});
Inactive.args = {
  status: "לא פעיל",
};

export const Pending = Template.bind({});
Pending.args = {
  status: "בהמתנה",
};
