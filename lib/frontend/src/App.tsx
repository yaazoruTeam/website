// import React from 'react';
// import './App.css';
// // import Header from './components/layout/header';
// import SideNav from './components/layout/SideNav';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         {/* <Header /> */}
//         <SideNav />

//       </header>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./App.css";
import SideNav from "./components/layout/SideNav";

import Dashboard from "./components/dashboard/dashboard";
import Customers from "./components/customers/customers";
import Devices from "./components/devices/devices";
import Header from "./components/layout/Header";

import dashboardIconWhite from "../src/assets/dashboardIcon-white.svg";
import dashboardIconBlue from "../src/assets/dashboardIcon-blue.svg";

import customerIconWhite from "../src/assets/customerIcon-white.svg";
import customerIconBlue from "../src/assets/customerIcon-blue.svg";

import devicesIconWhite from "../src/assets/deviceIcon-white.svg";
import devicesIconBlue from "../src/assets/deviceIcon-blue.svg";

const theme = createTheme({
  typography: {
    fontFamily: "Assistant, sans-serif",
    fontSize: 18
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header
          placeholderText="הקלד שם לקוח / מספר מכשיר"
          searchIconColor="#7d97c5"
          backgroundColor="white"
          textFieldColor="var(--Color-21, rgba(229, 242, 255, 0.50))"
        />

        <div style={{ display: "flex" }}>
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

          <main style={{ flexGrow: 1, padding: "20px" }}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" Component={Customers} />
              <Route path="/devices" element={<Devices />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
