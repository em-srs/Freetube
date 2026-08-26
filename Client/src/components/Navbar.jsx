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
    <Link to="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <img
        src={logo}
        alt="FreeTube"
        height={46}
        style={{
          borderRadius: "12px",
          filter: "drop-shadow(0 0 10px rgba(255, 30, 66, 0.6))",
        }}
      />
      <Box style={{ display: "flex", alignItems: "center" }}>
        <Typography
          variant="h6"
          fontWeight="900"
          sx={{
            background: "linear-gradient(135deg, #00F5D4 0%, #7B2CBF 50%, #FF007A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
            fontSize: { xs: "18px", sm: "22px" },
            lineHeight: 1.1,
            textShadow: "0 0 20px rgba(255, 0, 122, 0.4)",
          }}
        >
          Free<span style={{ color: "#FF007A", WebkitTextFillColor: "#FF007A" }}>Tube</span>
        </Typography>
      </Box>
    </Link>

    <SearchBar />
  </Stack>
);

export default Navbar;
