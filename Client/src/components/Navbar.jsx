import React from "react";
import { Stack, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { logo } from "../utils/constants";
import { SearchBar } from "./";

const Navbar = () => (
  <Stack
    direction="row"
    alignItems="center"
    p={2}
    className="glass-nav"
    sx={{
      position: "sticky",
      top: 0,
      justifyContent: "space-between",
      zIndex: 100,
      px: { xs: 2, md: 4 },
      py: 1.5,
    }}
  >
    <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img src={logo} alt="Vision Hub" height={42} style={{ filter: "drop-shadow(0 0 8px rgba(255, 30, 66, 0.4))" }} />
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <Typography
          variant="h6"
          fontWeight="800"
          sx={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
            lineHeight: 1.1,
          }}
        >
          Vision <span style={{ color: "#FF1E42" }}>Hub</span>
        </Typography>
      </Box>
    </Link>

    <SearchBar />
  </Stack>
);

export default Navbar;
