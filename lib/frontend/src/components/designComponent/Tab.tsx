import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { colors } from "../../styles/theme";
import CustomTypography from "./Typography";

const TabPanel: React.FC<{ value: number; index: number; children: React.ReactNode }> = ({ value, index, children }) => {
    return (
        <div role="tabpanel" style={{ display: value === index ? 'block' : 'none' }}/*hidden={value !== index}*/>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

type CustomTabsProps = {
    tabs: { label: string; content: React.ReactNode }[];
};

const CustomTabs: React.FC<CustomTabsProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState<number>(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ width: "100%", direction: "rtl", overflow: "hidden" }}>
            <Tabs value={activeTab} onChange={handleChange} aria-label="custom styled tabs" sx={{ display: 'flex', overflowX: 'auto' }}>
                {tabs.map((tab, index) => (
                    <Tab
                        label={
                            <CustomTypography
                                text={tab.label}
                                variant="h4"
                                weight={activeTab === index ? "medium" : "regular"}
                                color={activeTab === index?colors.brand.color_10:colors.brand.color_12}
                            />
                        }
                        key={index}
                        sx={{
                            width: 200,
                            height: 48,
                            padding: 1,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            borderBottom: `1px ${colors.brand.color_12} solid`,
                            display: 'inline-flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 2,
                            backgroundColor: 'transparent',
                            '&:hover': {
                                backgroundColor: colors.brand.color_15,
                            },
                            transition: 'background-color 0.3s',
                            marginRight: '5px',
                        }}
                    />
                ))}
            </Tabs>

            {tabs.map((tab, index) => (
                <TabPanel value={activeTab} index={index} key={index}>
                    {tab.content}
                </TabPanel>
            ))}
        </Box>
    );
};

export default CustomTabs;
