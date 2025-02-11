import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { getUserById } from "../../api/userApi";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logOut from "../../assets/Log-out.svg";
import { CustomButton } from "../../stories/Button/Button";


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
  const navigate = useNavigate();
  const [token, setToken] = useState<string>('');
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUserFromToken(token);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken('');
    setUserName(null);
  };

  const getUserFromToken = async (token: string) => {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      const user_id: string = decodedPayload.user_id;
      const user = await getUserById(user_id);
      setUserName(user.first_name);
      return user;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  };
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: backgroundColor,
        height: "108px",
        boxShadow: "none",
        justifyContent: "center",
        padding: "0 16px",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginLeft: "20%",
          height: "100%",
        }}
      >
        {!token ? (
          <CustomButton
            label="התחברות"
            sx={{
              background: "white",
              color: "#032B40",
              border: "1px rgba(11.47, 57.77, 81.74, 0.36) solid",
              "&:hover": {
                background: "#f9fafc",
              },
            }}
            onClick={() => navigate('/login')}
          />
        ) : (
          <Box
            sx={{
              width: '14%',
              height: '100%',
              justifyContent: 'flex-start',
              alignItems: 'center',
              display: 'inline-flex',
            }}
          >
            <Box sx={{ width: 45.5, height: 45.5, position: 'relative' }}>
              <Box
                sx={{
                  width: 45.5,
                  height: 45.5,
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  backgroundColor: '#E5F2FF',
                  borderRadius: '9999px',
                }}
              />
              <Typography
                sx={{
                  width: 13,
                  height: 42.62,
                  position: 'absolute',
                  left: 17.25,
                  top: 0.25,
                  color: '#0A425F',
                  fontSize: 28,
                  fontFamily: 'Heebo',
                  fontWeight: 500,
                  lineHeight: '33.60px',
                  wordWrap: 'break-word',
                }}
              >
                {userName?.charAt(0)}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 120,
                pl: 2,
                pr: 2,
                pt: 1,
                pb: 1, 
                borderRadius: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1,
                display: 'flex',
                cursor: 'pointer',
              }}
              onClick={handleLogout}
            >
              <Typography
                sx={{
                  textAlign: 'right',
                  color: '#0059BA',
                  fontSize: 17,
                  fontFamily: 'Heebo',
                  fontWeight: 400,
                  wordWrap: 'break-word',
                }}
              >
                התנתקות
              </Typography>
              <Box sx={{ width: 24, height: 24, position: 'relative' }}>
                <img src={logOut} alt="" />

              </Box>
            </Box>
          </Box>
        )}

        <TextField
          variant="standard"
          placeholder={placeholderText}
          sx={{
            width: "60%",
            height: 53,
            mr: '20%',
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
