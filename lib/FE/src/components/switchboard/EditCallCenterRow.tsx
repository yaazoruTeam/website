import { Box } from "@mui/material";

//to do : לעדכן את סוג הנתונים לסוג המתאים
const EditCallCenterRow: React.FC<{ call: any }> = ({ call }) => {
    return (<Box>
        {call.organizationName}
        עריכת שורה במרכזיית שיחות
    </Box>)
}

export default EditCallCenterRow;