import React, { useState } from "react";
import { Stack, Chip, IconButton, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import TuneIcon from "@mui/icons-material/Tune";

import { logo } from "../utils/constants";
import { SearchBar } from "./";
import ConnectYouTubeBtn from "./ConnectYouTubeBtn";
import InterestsModal from "./InterestsModal";

const Navbar = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        p={2}
        sx={{
          position: "sticky",
          background: "#000",
          top: 0,
          justify: "space-between",
          zIndex: 100,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="logo" height={45} />
          </Link>
          <Chip
            label="🇮🇳 India (Default)"
            size="small"
            sx={{
              backgroundColor: "#1e1e1e",
              color: "#aaa",
              fontSize: "11px",
              fontWeight: "bold",
              height: "24px",
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" gap={1.5} sx={{ ml: "auto" }}>
          <SearchBar />

          <Tooltip title="Customize Your Feed Topics">
            <IconButton
              onClick={() => setModalOpen(true)}
              sx={{ color: "#fff", backgroundColor: "#1e1e1e", "&:hover": { backgroundColor: "#333" } }}
            >
              <TuneIcon />
            </IconButton>
          </Tooltip>

          <ConnectYouTubeBtn />
        </Stack>
      </Stack>

      <InterestsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onInterestsUpdated={() => {
          // Trigger feed refresh if on home
          window.dispatchEvent(new Event("storage"));
        }}
      />
    </>
  );
};

export default Navbar;
