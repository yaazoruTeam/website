import React from "react";
import Button from "@mui/material/Button";
import { colors } from "../../styles/theme";
import { useNavigate } from "react-router-dom";

const ReturnButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(-1)}
      sx={{
        textAlign: "center",
        color: colors.c11,
        fontSize: 18,
        fontFamily: "Heebo",
        fontWeight: 400,
        textDecoration: "underline",
        wordWrap: "break-word",
        padding: 0,
        minWidth: "auto",
        backgroundColor: "transparent",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "transparent",
          textDecoration: "underline",
          boxShadow: "none",
        },
      }}
      disableRipple
    >
      {"חזרה >"}
    </Button>
  );
};

export default ReturnButton;
