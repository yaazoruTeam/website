import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

interface HeaderProps {
  placeholderText: string;
  searchIconColor: string;
  backgroundColor: string;
  textFieldColor: string;
}

const Header: React.FunctionComponent<HeaderProps> = ({
  placeholderText,
  searchIconColor,
  backgroundColor,
  textFieldColor,
}) => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: backgroundColor,
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
          placeholder={placeholderText}
          sx={{
            width: "60%",
            height: 53,
            "& .MuiInput-underline:before": { borderBottom: "none" },
            "& .MuiInput-underline:after": { borderBottom: "none" },
            "& .MuiInputBase-input": {
              backgroundColor: textFieldColor,
              borderRadius: "43px",
              padding: "12px 24px",
              textAlign: "right",
              direction: "rtl",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon
                  sx={{
                    color: searchIconColor,
                    position: "absolute",
                    marginRight: "1000px",
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
