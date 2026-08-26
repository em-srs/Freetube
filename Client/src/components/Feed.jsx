import React, { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";

import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos, Sidebar } from "./";

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    setVideos(null);

    fetchFromAPI(`search?part=snippet&q=${selectedCategory}`).then((data) =>
      setVideos(data.items || [])
    );
  }, [selectedCategory]);

  return (
    <Stack sx={{ flexDirection: { sx: "column", md: "row" }, backgroundColor: "#0A0C10", minHeight: "92vh" }}>
      <Box
        sx={{
          height: { sx: "auto", md: "92vh" },
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          px: { sx: 0, md: 2 },
          py: 1,
        }}
      >
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <Typography
          className="copyright"
          variant="body2"
          sx={{ mt: 1.5, color: "#64748B", fontSize: "12px", textAlign: "center" }}
        >
          © 2026 FreeTube Platform
        </Typography>
      </Box>

      <Box p={{ xs: 2, md: 3 }} sx={{ overflowY: "auto", height: "90vh", flex: 2 }}>
        <Typography
          variant="h4"
          fontWeight="800"
          mb={3}
          sx={{
            color: "white",
            fontSize: { xs: "22px", md: "28px" },
            letterSpacing: "-0.5px",
          }}
        >
          {selectedCategory} <span style={{ color: "#FF1E42" }}>Videos</span>
        </Typography>

        <Videos videos={videos} />
      </Box>
    </Stack>
  );
};

export default Feed;
