import CustomTable from "./CustomTable";
import { Box } from "@mui/material";

export default {
  title: "Components/CustomTable",
  component: CustomTable,
};

const sampleData = [
  {
    customer_id: 4,
    first_name: "יהודה",
    last_name: "פרקש",
    id_number: "214457124",
    phone_number: "0556722985",
    additional_phone: "03-5884523",
    email: "y0556722985@gmail.com",
    city: "בני ברק",
    address1: "רחוב עזרא 9",
    address2: "",
    zipCode: "14587",
  },
  {
    customer_id: 4,
    first_name: "יהודה",
    last_name: "פרקש",
    id_number: "214457124",
    phone_number: "0556722985",
    additional_phone: "03-5884523",
    email: "y0556722985@gmail.com",
    city: "בני ברק",
    address1: "רחוב עזרא 9",
    address2: "",
    zipCode: "14587",
  },
];

export const Default = () => (
  <Box sx={{ maxWidth: "90%", margin: "auto" }}>
    <CustomTable data={sampleData} />
  </Box>
);
