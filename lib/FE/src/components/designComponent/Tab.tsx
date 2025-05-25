import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { colors } from "../../styles/theme";
import CustomTypography from "./Typography";

const TabPanel: React.FC<{
  value: number;
  index: number;
  children: React.ReactNode;
}> = ({ value, index, children }) => {
  return (
    <div
      role="tabpanel"
      style={{
        display: value === index ? "block" : "none",
      }} /*hidden={value !== index}*/
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

type CustomTabsProps = {
  tabs: { label: string; content: React.ReactNode }[];
  editingContacts?: boolean;
  sideComponent?: React.ReactNode;
};

const CustomTabs: React.FC<CustomTabsProps> = ({
  tabs,
  editingContacts,
  sideComponent,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getColor = (index: number) => {
    if (editingContacts) {
      return activeTab === index ? colors.c2 : colors.c22;
    }
    return activeTab === index ? colors.c0 : colors.c22;
  };

  return (
    <Box sx={{ width: "100%", direction: "rtl", overflow: "hidden" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tabs
          value={activeTab}
          onChange={handleChange}
          aria-label="custom styled tabs"
          TabIndicatorProps={{
            style: { backgroundColor: colors.c2, height: "1px" },
          }}
          sx={{ display: "flex", overflowX: "auto" }}
        >
          {tabs.map((tab, index) => (
            <Tab
              label={
                <CustomTypography
                  text={tab.label}
                  variant="h4"
                  weight={activeTab === index ? "medium" : "regular"}
                  color={getColor(index)}
                  sx={{
                    textAlign: editingContacts ? "center" : "right",
                    width: "100%",
                    display: "block",
                  }}
                />
              }
              key={index}
              sx={{
                width: editingContacts ? "160px" : 200,
                height: 48,
                padding: 1,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottom: `1px ${colors.c22} solid`,
                display: "inline-flex",
                justifyContent: "flex-end",
                gap: 5,
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: colors.c14,
                },
                transition: "all 0.3s ease",
                marginRight: "5px",
              }}
            />
          ))}
        </Tabs>
        {activeTab === (sideComponentTabIndex ?? 1) && (
          <Box
            sx={{
              ml: 2,
              height: "48px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {sideComponent}
          </Box>
        )}
      </Box>

      {tabs.map((tab, index) => (
        <TabPanel value={activeTab} index={index} key={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default CustomTabs;
