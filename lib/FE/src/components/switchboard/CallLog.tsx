import { useState } from "react";
import { Box } from "@mui/material";
import CustomTypography from "../designComponent/Typography";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { CustomButton } from "../designComponent/Button";
import {
  ArrowDownOnSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import PhoneNumber from "./PhoneNumer";
import { formatDateToString } from "../designComponent/FormatDate";
import CustomTable from "../designComponent/CustomTable";

const CallLog: React.FC = () => {
  const { t } = useTranslation();
  const { callId } = useParams();
  const [calls, setCalls] = useState<any[]>([
    //to do:Change the data type to match the actual data.
    {
      country: "972-79-606-4286",
      target: "1-973-964-0286",
      date: Date.now(),
      durationCall: "01:04:23",
      timeCall: "23:44:00 pm",
      costInShekels: "03.00",
      penniesPerMinute: "04.00",
    },
  ]);

  //to to:useEffect to fetch the data from the server

  const columns = [
    { label: t("country"), key: "country" },
    { label: t("target"), key: "target" },
    { label: t("date"), key: "date" },
    { label: t("durationCall"), key: "durationCall" },
    { label: t("timeCall"), key: "timeCall" },
    { label: t("costInShekels"), key: "costInShekels" },
    { label: t("penniesPerMinute"), key: "penniesPerMinute" },
  ];

  const tableData = calls.map((call) => ({
    country: <PhoneNumber country="Israel" phoneNumber={call.country} />,
    target: <PhoneNumber country="USA" phoneNumber={call.target} />,
    date: formatDateToString(call.date),
    durationCall: call.durationCall,
    timeCall: call.timeCall,
    costInShekels: call.costInShekels,
    penniesPerMinute: call.penniesPerMinute,
  }));

  console.log("callId", callId);

  const downloadFile = () => {
    if (calls.length === 0) return;

    const headers = Object.keys(calls[0]);
    const csvRows = [
      headers.join(","),
      ...calls.map((row) =>
        headers.map((field) => `"${row[field]}"`).join(",")
      ),
    ];

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "call_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const refresh = () => {
    //to do: refresh list - Re-fetch the data - send to useEffect again
    console.log("Refreshing...");
    setCalls([
      //to do: Change this to fetch the actual data from the server
      {
        country: "972-79-606-4286",
        target: "1-973-964-0286",
        date: Date.now(),
        durationCall: "01:04:23",
        timeCall: "23:44:00 pm",
        costInShekels: "03.00",
        penniesPerMinute: "04.00",
      },
    ]);
  };

  return (
    <Box
      sx={{
        paddingLeft: "10%",
        paddingRight: "15%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              gap: "10px",
            }}
          >
            <CustomTypography
              variant="h1"
              weight="bold"
              text={`${t("callLog")} /`}
            />
            <CustomTypography
              variant="h2"
              weight="regular"
              text={`${callId}`}
            />
          </Box>
          {/*to do : לבדוק מאיפה מגיעים הנתונים של זה ולשנות את זה לנתונים האמיתיים אחרי קראית שרת.*/}
          <CustomTypography
            variant="h3"
            weight="regular"
            text={`${t("total")} 146 ${t("calls")} ${t("during")} 06:32:42 ${t(
              "hours"
            )} $3.765`}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <CustomButton
            label={t("downloadingFile")}
            icon={<ArrowDownOnSquareIcon />}
            sx={{ flexDirection: "row-reverse" }}
            onClick={downloadFile}
          />
          <CustomButton
            label={t("refresh")}
            icon={<ArrowPathIcon />}
            sx={{ flexDirection: "row-reverse" }}
            onClick={refresh}
          />
        </Box>
      </Box>
      <CustomTable columns={columns} data={tableData} />
    </Box>
  );
};

export default CallLog;
