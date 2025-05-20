import { Box } from "@mui/material";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CustomIconButton } from "../designComponent/ButtonIcon";
import EditingContactsForm from "./EditingContactsForm";
import CountryList from "./CountryList";

const EditingContacts: React.FC = () => {
  const [forms, setForms] = useState<number[]>([0]);
  const [counter, setCounter] = useState(1);

  const handleAddForm = () => {
    setForms([...forms, counter]);
    setCounter(counter + 1);
  };

  // to do: Save all forms and their content to the server-side DB and load them when the page reloads
  // Future step – currently only local state is used

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexShrink: 0,
          alignSelf: "flex-start",
        }}
      ></Box>

      <CountryList />
      {forms.map((formId) => (
        <EditingContactsForm key={formId} />
      ))}

      <Box display="flex" justifyContent="flex-start">
        <CustomIconButton
          icon={<PlusIcon />}
          buttonType="third"
          state="default"
          onClick={handleAddForm}
        />
      </Box>
    </Box>
  );
};

export default EditingContacts;
