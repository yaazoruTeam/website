import { Meta, StoryFn } from "@storybook/react";
import { CustomButton } from "./Button";
import trashIcon from '../../assets/trash-can.svg';

export default {
  title: "Stories/CustomButton",
  component: CustomButton,
  argTypes: {
    disabled: { control: "boolean" },
  },
} as Meta<typeof CustomButton>;

const commonBackgroundColor = "#FF7F07";
const cancelBackgroundColor = "#F5F6FA";
const cancelTextColor = "#0A425F";
const commonHoverStyles = {
  "&:hover": {
    background: "#0a425f",
  },
};

const Template: StoryFn<typeof CustomButton> = (args) => <CustomButton {...args} />;

// כפתור "הזמנה חדשה"
export const AddNewOrder = Template.bind({});
AddNewOrder.args = {
  label: "הזמנה חדשה",
  sx: { background: commonBackgroundColor, color: "white", ...commonHoverStyles },
};

// כפתור "התחברות למערכת"
export const LoginToSystem = Template.bind({});
LoginToSystem.args = {
  label: "התחברות למערכת",
  sx: {  background: commonBackgroundColor, color: "white", ...commonHoverStyles },
};

// כפתור "הוספת סניף חדש"
export const AddNewBranch = Template.bind({});
AddNewBranch.args = {
  label: "הוספת סניף חדש",
  sx: {  background: commonBackgroundColor, color: "white", ...commonHoverStyles },
};

// כפתור "שמירת שינויים"
export const SaveChanges = Template.bind({});
SaveChanges.args = {
  label: "שמירת שינויים",
  sx: {  background: commonBackgroundColor, color: "white", ...commonHoverStyles },
};

// כפתור "העברת מכשיר"
export const TransferDevice = Template.bind({});
TransferDevice.args = {
  label: "העברת מכשיר",
  sx: {  background: commonBackgroundColor, color: "white", ...commonHoverStyles },
};

// כפתור "הוספת לקוח חדש"
export const AddNewCustomer = Template.bind({});
AddNewCustomer.args = {
  label: "הוספת לקוח חדש",
  sx: {  background: commonBackgroundColor, color: "white", ...commonHoverStyles },
};

// כפתור "שמירה"
export const Save = Template.bind({});
Save.args = {
  label: "שמירה",
  sx: {  background: commonBackgroundColor, color: "white", ...commonHoverStyles },
};

// כפתור "הוספת מכשיר חדש"
export const AddNewDevice = Template.bind({});
AddNewDevice.args = {
  label: "הוספת מכשיר חדש",
  sx: {  background: commonBackgroundColor, color: "white", ...commonHoverStyles },
};

// כפתור "שמור"
export const SaveButton = Template.bind({});
SaveButton.args = {
  label: "שמור",
  sx: {  background: commonBackgroundColor, color: "white", ...commonHoverStyles },
};

// כפתור "הוסף"
export const AddButton = Template.bind({});
AddButton.args = {
  label: "הוסף",
  sx: {  background: commonBackgroundColor, color: "white", ...commonHoverStyles },
};

// כפתור "ביטול"
export const Cancel = Template.bind({});
Cancel.args = {
  label: "ביטול",
  sx: {
    background: cancelBackgroundColor,
    color: cancelTextColor,
    "&:hover": {
      background: "#e5f2ff",
    },
  },
};

// כפתור "מחיקת לקוח"
export const DeleteCustomer = Template.bind({});
DeleteCustomer.args = {
  label: "מחיקת לקוח",
  sx: {
    background: "white",
    color: "#032B40",
    border: "1px rgba(11.47, 57.77, 81.74, 0.36) solid",
    "&:hover": {
      background: "#f9fafc",
    },
  },
  img: trashIcon,
};
