import CustomTable from "../../components/designComponent/CustomTable";
import { Box } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "../../styles/theme";

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
    customer_id: 5,
    first_name: "דני",
    last_name: "כהןכהןכהן",
    id_number: "214457125",
    phone_number: "0556722986",
    additional_phone: "03-5884524",
    email: "danny@gmail.com",
    city: "תל אביב",
    address1: "רחוב גולדה מאיר 10",
    address2: "",
    zipCode: "65432",
  },
];

const sampleHeaders = [
  { label: "מספר לקוח", key: "customer_id" },
  { label: "שם פרטי", key: "first_name" },
  { label: "שם משפחה", key: "last_name" },
  { label: "מספר תעודת זהות", key: "id_number" },
  { label: "מספר טלפון", key: "phone_number" },
  { label: "טלפון נוסף", key: "additional_phone" },
  { label: "אימייל", key: "email" },
  { label: "עיר", key: "city" },
  { label: "כתובת 1", key: "address1" },
  { label: "כתובת 2", key: "address2" },
  { label: "מיקוד", key: "zipCode" },
];

export const Default = () => (
  <Box sx={{ maxWidth: "90%", margin: "auto" }}>
     <ThemeProvider theme={theme}>
    <CustomTable columns={sampleHeaders} data={sampleData} />
    </ThemeProvider>
  </Box>
);
