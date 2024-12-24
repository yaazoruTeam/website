import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./App.css";
import SideNav from "./components/layout/SideNav";

import Dashboard from "./components/dashboard/dashboard";
import Customers from "./components/customers/customers";
import Devices from "./components/devices/devices";
import Header from "./components/layout/Header";
import Login from "./components/auth/Login";


import ProtectedRoute from "./components/ProtectedRoute";


import dashboardIconWhite from "../src/assets/dashboardIcon-white.svg";
import dashboardIconBlue from "../src/assets/dashboardIcon-blue.svg";

import customerIconWhite from "../src/assets/customerIcon-white.svg";
import customerIconBlue from "../src/assets/customerIcon-blue.svg";

import devicesIconWhite from "../src/assets/deviceIcon-white.svg";
import devicesIconBlue from "../src/assets/deviceIcon-blue.svg";

import { setupAxiosInterceptors } from "./api/axiosInterceptor"; // ייבוא הפונקציה


const theme = createTheme({
  typography: {
    fontFamily: "Assistant, sans-serif",
    fontSize: 18
  },
});

function App() {

  const navigate = useNavigate(); // הגדרת הניווט

  useEffect(() => {
    setupAxiosInterceptors(navigate);
  }, [navigate]);

  return (
    <ThemeProvider theme={theme}>
        <ProtectedRoute>
          <Header
            placeholderText="הקלד שם לקוח / מספר מכשיר"
            searchIconColor="#7d97c5"
            backgroundColor="white"
            textFieldColor="var(--Color-21, rgba(229, 242, 255, 0.50))"
          />
        </ProtectedRoute>

        <div style={{ display: "flex" }}>
          <ProtectedRoute>
            <SideNav
              listItems={[
                {
                  iconWhite: dashboardIconWhite,
                  iconBlue: dashboardIconBlue,
                  link: "../dashboard",
                  text: "דאשבורד",
                },
                {
                  iconWhite: customerIconWhite,
                  iconBlue: customerIconBlue,
                  link: "../customers",
                  text: "לקוחות",
                },
                {
                  iconWhite: devicesIconWhite,
                  iconBlue: devicesIconBlue,
                  link: "../devices",
                  text: "מכשירים",
                },
              ]}
            />
          </ProtectedRoute>
          <main style={{ flexGrow: 1, padding: "20px" }}>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/customers" element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              } />
              <Route path="/devices" element={
                <ProtectedRoute>
                  <Devices />
                </ProtectedRoute>
              } />
            </Routes>

          </main>
        </div>
    </ThemeProvider >
  );
}

export default App;
