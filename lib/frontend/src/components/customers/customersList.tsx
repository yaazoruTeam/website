import React from "react";
import { Button, Box, Typography } from "@mui/material";

interface CustomersListProps {
  customers: string[];
}

const CustomersList: React.FC<CustomersListProps> = ({ customers }) => {
  return (
    <Box
      sx={{
        width: "50%",
        height: "50%",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",       
        gap: 4,
      }}
    >
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#D55188",
          borderRadius: "40px",
          paddingLeft: 3,
          paddingRight: 3,
          paddingTop: 1,
          paddingBottom: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          color: "white",
          fontWeight: 500,
          fontSize: 20,
          textAlign: "center",
          textTransform: "none",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Assistant, sans-serif",
            wordWrap: "break-word",
          }}
        >
          הוספת לקוח חדש
        </Typography>
      </Button>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 3,
        }}
      >
        {customers.map((customer, index) => (
          <Button
            key={index}
            sx={{
              width: 1000,
              height: 81,
              paddingLeft: 3,
              paddingRight: 3,
              backgroundColor: "white",
              borderRadius: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              cursor: "pointer",
              gap: 3,
              textTransform: "none",
              border: "none",
              "&:hover": {
                backgroundColor: "#f1f1f1",
              },
            }}
          >
            <Typography
              sx={{
                color: "#0059BA",
                fontSize: 28,
                fontFamily: "Assistant, sans-serif",
                fontWeight: 600,
                lineHeight: 1.2,
                wordWrap: "break-word",
                textAlign: "center",
              }}
            >
              {customer}
            </Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default CustomersList;
