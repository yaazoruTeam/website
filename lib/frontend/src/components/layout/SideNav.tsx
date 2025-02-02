import React, { useState } from "react";
import { Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

import logoIcon from "../../assets/logoIcon.svg";

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
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 150,
          backgroundColor: "#0a425f",
          color: "white",
          borderRadius: "22px 0px 0px 22px"
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
            width: "80px",
            height: "auto",
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
              color: selectedLink === li.link ? "#80E4FF" : "white",
              textAlign: "center",
              flexDirection: "column",
              alignItems: "center",
              paddingY: 2,
              transition: "color 0.3s ease",
            }}
          >
            <img
              src={selectedLink === li.link ? li.iconBlue : li.iconWhite}
              alt={`${li.text} icon`}
              style={{
                width: "40px",
                height: "40px",
                marginRight: "10px",
              }}
            />
            <ListItemText primary={li.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideNav;
