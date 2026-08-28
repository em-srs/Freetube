import React, { useState } from "react";
import { Stack, Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Chip } from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { Link } from "react-router-dom";

import { logo } from "../utils/constants";
import { SearchBar } from "./";
import { getStoredCustomKey, setCustomApiKey, getApiKeysList } from "../utils/fetchFromAPI";

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);
  const [customKey, setCustomKeyInput] = useState(getStoredCustomKey());

  const handleSave = () => {
    setCustomApiKey(customKey);
    setOpenModal(false);
    window.location.reload();
  };

  const activeKeysCount = getApiKeysList().length;

  return (
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

      <Stack direction="row" spacing={1.5} alignItems="center">
        <SearchBar />

        <Button
          onClick={() => setOpenModal(true)}
          startIcon={<VpnKeyIcon />}
          sx={{
            color: "#FFFFFF",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "20px",
            px: 2,
            py: 0.6,
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(255, 30, 66, 0.2)",
              borderColor: "#FF1E42",
            },
          }}
        >
          API Key 🔑
        </Button>
      </Stack>

      {/* API Key Settings Dialog */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#141722",
            color: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            maxWidth: "500px",
            width: "100%",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "20px" }}>
          RapidAPI Key Settings 🔑
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#94A3B8" mb={2}>
            Paste your free RapidAPI YouTube v3 key below (or multiple keys separated by commas).
          </Typography>

          <Stack direction="row" spacing={1} mb={2} alignItems="center">
            <Typography variant="caption" color="#94A3B8">Active Keys Loaded:</Typography>
            <Chip label={`${activeKeysCount} Key(s)`} size="small" color="error" />
          </Stack>

          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder="e.g. 754c8cf31cmsha90e75ae79b..."
            value={customKey}
            onChange={(e) => setCustomKeyInput(e.target.value)}
            sx={{
              backgroundColor: "#0A0C10",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                color: "#FFFFFF",
                fontSize: "13px",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
                "&:hover fieldset": { borderColor: "#FF1E42" },
                "&.Mui-focused fieldset": { borderColor: "#FF1E42" },
              },
            }}
          />

          <Typography variant="caption" sx={{ color: "#64748B", display: "block", mt: 1.5 }}>
            Don't have a key? Get a free key instantly at{" "}
            <a
              href="https://rapidapi.com/ytdl-org-ytdl-org-default/api/youtube-v31"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#FF1E42", textDecoration: "underline" }}
            >
              RapidAPI YouTube v3
            </a>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: "#94A3B8" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #ff1e42 0%, #ff523b 100%)",
              color: "#FFFFFF",
              fontWeight: 700,
              borderRadius: "20px",
              px: 3,
            }}
          >
            Save & Reload
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Navbar;
