import React, { useState } from "react";
import { Box, Drawer, List, ListItem } from "@mui/material";
import { Link } from "react-router-dom";

import logoIcon from "../../assets/logoIcon.svg";
import { colors } from "../../styles/theme";
import CustomTypography from "../designComponent/Typography";

interface SideNavProps {
  listItems: Array<{
    iconWhite: string;
    iconBlue: string;
    link: string;
    text: string;
  }>;
}

const SideNav: React.FunctionComponent<SideNavProps> = (props) => {
  const [selectedLink, setSelectedLink] = useState<string>("");

  const handleLinkClick = (link: string) => {
    setSelectedLink(link);
  };

  return (
    <Drawer
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 130,
          backgroundColor: colors.brand.color_8,
          color: colors.neutral.white,
          borderRadius: "22px 0px 0px 22px",
          display: "flex",
          flexDirection: "column",
        },
      }}
      variant="permanent"
      anchor="right"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
          padding: "10px",
        }}
      >
        <img
          src={logoIcon}
          alt="Logo"
          style={{
            width: "67px",
            height: "64px",
          }}
        />
      </Box>

      <List>
        {props.listItems.map((li, index) => (
          <ListItem
            key={index}
            component={Link}
            to={li.link}
            onClick={() => handleLinkClick(li.link)}
            sx={{
              color: selectedLink === li.link ? colors.brand.color_3 : colors.neutral.white,
              textAlign: "center",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              transition: "color 0.3s ease",
              display: "inline-flex", 
              height: 66,
              marginTop:'10px'
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "32px",
                height: "32px",
              }}
            >
              <img
                src={selectedLink === li.link ? li.iconBlue : li.iconWhite}
                alt={`${li.text} icon`}
                style={{
                  width: "32px",
                  height: "32px",
                  position: "absolute",
                  top: "0",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </Box>
            <CustomTypography
              text={li.text}
              variant="h4"
              weight="regular"
              color={selectedLink === li.link ? colors.brand.color_3 : colors.neutral.white}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideNav;
