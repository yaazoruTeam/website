// import React from "react";
// import { StoryFn, Meta } from "@storybook/react";
// import { useForm, FormProvider } from "react-hook-form";
// import CustomSearchSelect from "../../components/designComponent/CustomSearchSelect";

// export default {
//   title: "Components/CustomSearchSelect",
//   component: CustomSearchSelect,
// } as Meta;

// const Template: StoryFn = (args) => {
//   const methods = useForm();
//   return (
//     <FormProvider {...methods}>
//       <CustomSearchSelect
//         name="city" // הוסף את ה-name כאן // הוסף את ה-label כאן
//         options={[
//           { label: "תל אביב", value: "tel_aviv" },
//           { label: "ירושלים", value: "jerusalem" },
//           { label: "חיפה", value: "haifa" },
//         ]} // הוסף את ה-options כאן
//         {...args}
//         control={methods.control}
//         placeholder="עיר לקוח"
//       />
//     </FormProvider>
//   );
// };

// export const Default = Template.bind({});
// Default.args = {};

import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { useForm, FormProvider } from "react-hook-form";
import CustomSearchSelect from "../../components/designComponent/CustomSearchSelect";

export default {
  title: "Components/CustomSearchSelect",
  component: CustomSearchSelect,
} as Meta;

const Template: StoryFn = (args) => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <CustomSearchSelect 
        // options={[
        //   { label: "תל אביב", value: "tel_aviv" },
        //   { label: "ירושלים", value: "jerusalem" },
        //   { label: "חיפה", value: "haifa" },
        // ]} // הוספת options
        {...args}
        placeholder="עיר לקוח"
        searchType="date"
      />
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
