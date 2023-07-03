import React from "react";
import "./Header.css";
import Box from "@mui/material/Box";

const Header = ({ children }) => {
  return (
    <Box className="header">
      <Box component="span">
        <img src="/Logo.png" alt="Logo"></img>
      </Box>
      {children}
    </Box>
  );
};

export default Header;
