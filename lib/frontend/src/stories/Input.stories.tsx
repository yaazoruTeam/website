import { Meta, StoryFn } from "@storybook/react";
import { CustomTextField, CustomTextFieldProps } from "../components/designComponent/Input";
import { useForm } from "react-hook-form";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "../styles/theme";
import { XCircleIcon } from '@heroicons/react/24/outline'

export default {
  title: "Stories/CustomTextField",
  component: CustomTextField,
} as Meta<typeof CustomTextField>;

const Template: StoryFn<CustomTextFieldProps> = (args) => {
  const { control } = useForm();
  return (
    <ThemeProvider theme={theme}> {/* עטוף את הקומפוננטה ב-ThemeProvider */}
      <CustomTextField {...args} control={control} />
    </ThemeProvider>
  );;
};

export const DefaultField = Template.bind({});
DefaultField.args = {
  name: "default",
  label: "Default Label",
  helperText: "This is a helper text",
};

export const ErrorField = Template.bind({});
ErrorField.args = {
  name: "error",
  label: "Error Field",
  errorMessage: "This field has an error",
};

export const EmailField = Template.bind({});
 EmailField.args = {
  name: "email",
  label: "אימייל",
  // helperText: "Please enter your email",
  type: "email",
  rules: {
    required: "אימייל הוא שדה חובה",
    pattern: {
      value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      message: "כתובת אימייל לא תקינה"
    }
  }
};

export const UserNameField = Template.bind({});
UserNameField.args = {
  name: "userName",
  label: "שם משתמש",
  // helperText: "Please enter your email",
  rules: {
    required: "שדה חובה"
  }
};

export const PasswordField = Template.bind({});
PasswordField.args = {
  name: "password",
  label: "סיסמה",
  type: "password",
  icon: <XCircleIcon />,
  // helperText: "Please enter your email",
  rules: {
    required: "שדה חובה",
    // minLength: {
    //   value: 6,
    //   message: "הסיסמה חייבת להיות לפחות 6 תווים"
    // }
  }
};

export const IdNumberField = Template.bind({});
IdNumberField.args = {
  name: "id_number",
  label: "מספר ת.ז",
  height:'96px',
  rules: {
    required: "שדה חובה",
    minLength: {
      value: 9,
      message: "מספר ת.ז צריך להיות 9 ספרות"
    },
    maxLength: {
      value: 9,
      message: "מספר ת.ז צריך להיות 9 ספרות",
    },
  }
};

export const FirstNameField = Template.bind({});
FirstNameField.args = {
  name: "first_name",
  label: "שם פרטי",
  rules: {
    required: "שדה חובה",
  },
  sx: { direction: 'rtl' }
};

export const LastNameField = Template.bind({});
LastNameField.args = {
  name: "last_name",
  label: "שם משפחה",
  rules: {
    required: "שדה חובה",
  },
  sx: { direction: 'rtl' }
};

export const PhoneNumberField = Template.bind({});
PhoneNumberField.args = {
  name: "phone_number",
  label: "טלפון",
  rules: {
    required: "שדה חובה",
    minLength: {
      value: 9,
      message: 'מספר טלפון צריך להיות לפחות 9 ספרות',
    },
    maxLength: {
      value: 15,
      message: 'מספר טלפון לא יכול להיות יותר מ-15 ספרות',
    },
    pattern: {
      value: /^\d+$/,
      message: 'מספר הטלפון חייב להכיל רק ספרות',
    },
  }
};

export const AdditionalPhoneField = Template.bind({});
AdditionalPhoneField.args = {
  name: "additional_phone",
  label: "מספר נוסף",
  rules: {
    minLength: {
      value: 9,
      message: 'מספר טלפון צריך להיות לפחות 9 ספרות',
    },
    maxLength: {
      value: 15,
      message: 'מספר טלפון לא יכול להיות יותר מ-15 ספרות',
    },
    pattern: {
      value: /^\d+$/,
      message: 'מספר הטלפון חייב להכיל רק ספרות',
    },
  }
};

export const AddressField = Template.bind({});
AddressField.args = {
  name: "address",
  label: "כתובת",
  rules: {
    required: "שדה חובה",
  },
  sx: { direction: 'rtl' }
};

export const CityField = Template.bind({});
CityField.args = {
  name: "city",
  label: "עיר",
  rules: {
    required: "שדה חובה",
  },
  sx: { direction: 'rtl' }
};
