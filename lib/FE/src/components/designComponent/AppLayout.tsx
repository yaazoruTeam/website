import React from "react";
import { Box } from "@mui/material";
import ReturnButton from "../designComponent/ReturnButton";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box
      sx={{
        paddingLeft: "10%",
        paddingRight: "15%",
        paddingTop: "2rem",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <ReturnButton />
      {children}
    </Box>
  );
};
