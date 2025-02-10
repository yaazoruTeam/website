import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface StatusProps {
  status: string;
}

const Status: React.FC<StatusProps> = ({ status }) => {
  let backgroundColor = "";

  switch (status) {
    case "פעיל":
      backgroundColor = "rgba(215, 255, 226, 0.52)";
      break;
    case "לא פעיל":
      backgroundColor = "rgba(255, 226, 226, 0.52)";
      break;
    case "בהמתנה":
      backgroundColor = "rgba(226, 241, 255, 0.52)";
      break;
    default:
      backgroundColor = "#6c757d";
  }
  return (
    <Box
      sx={{
        padding: "4px 16px",
        backgroundColor,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          textAlign: "right",
          color: "#032B40",
          fontSize: 16,
          fontFamily: "Heebo",
          fontWeight: 400,
        }}
      >
        {status}
      </Typography>
    </Box>
  );
};

export default Status;
