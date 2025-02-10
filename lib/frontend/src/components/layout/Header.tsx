import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { colors } from "../../styles/theme";



const Header: React.FunctionComponent = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: colors.neutral.white,
        height: "108px",
        boxShadow: "none",
        justifyContent: "center",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "20%",
          height: "100%",
        }}
      >
        <TextField
          variant="standard"
          placeholder="הקלד שם לקוח / מספר מכשיר"
          fullWidth
          sx={{
            width: "60%",
            height: '50px',
            borderRadius: "43px",
            backgroundColor: "rgba(229, 242, 255, 0.50)",
            "& .MuiInput-underline:before": { borderBottom: "none" },
            "& .MuiInput-underline:after": { borderBottom: "none" },
            "& .MuiInputBase-input": {
              backgroundColor: "transparent",
              textAlign: "right",
              direction: "rtl",
              padding: "12px 16px",
              fontSize: "18px",
              fontFamily: "Heebo",
              fontWeight: 400,
              color: colors.brand.color_8,
            },
            "& input::placeholder": {
              color: colors.brand.color_2,
              opacity: 1,
            },
            "@media (max-width: 600px)": {
              width: "100%",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  marginRight: "24px",
                }}
              >
                <MagnifyingGlassIcon
                  style={{
                    width: "16px",
                    height: "16px",
                    color: colors.brand.color_12,
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;

