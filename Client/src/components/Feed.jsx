import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Chip } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { fetchFromAPI } from "../utils/fetchFromAPI";
import { categories } from "../utils/constants";
import {
  getPersonalizedSearchQuery,
  getWatchHistory,
  getLikedVideos,
  getSavedVideos,
} from "../utils/recommendationEngine";
import { Videos, Sidebar } from "./";

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState("Recommended");
  const [videos, setVideos] = useState(null);
  const [recommendationContext, setRecommendationContext] = useState("");

  useEffect(() => {
    setVideos(null);
    setRecommendationContext("");

    if (selectedCategory === "Watch History") {
      setVideos(getWatchHistory());
      setRecommendationContext("Your Recently Viewed Videos");
      return;
    }

    if (selectedCategory === "Liked Videos") {
      setVideos(getLikedVideos());
      setRecommendationContext("Your Liked Videos Collection");
      return;
    }

    if (selectedCategory === "Saved Videos") {
      setVideos(getSavedVideos());
      setRecommendationContext("Your Saved Watch Later List");
      return;
    }

    let searchQuery = selectedCategory;
    let contextNotice = `Trending in India 🇮🇳`;

    if (selectedCategory === "Recommended") {
      searchQuery = getPersonalizedSearchQuery();
      contextNotice = `Tailored for You in India 🇮🇳 (Based on your watch history & interests)`;
    } else {
      const match = categories.find(c => c.name === selectedCategory);
      if (match && match.query) {
        searchQuery = match.query;
      }
    }

    setRecommendationContext(contextNotice);

    fetchFromAPI(`search?part=snippet&q=${encodeURIComponent(searchQuery)}`)
      .then((data) => setVideos(data.items || []))
      .catch((err) => {
        console.error("Failed to load feed:", err);
        setVideos([]);
      });
  }, [selectedCategory]);

  return (
    <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
      <Box
        sx={{
          height: { sx: "auto", md: "92vh" },
          borderRight: "1px solid #3d3d3d",
          px: { sx: 0, md: 2 },
        }}
      >
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <Typography
          className="copyright"
          variant="body2"
          sx={{ mt: 1.5, color: "#fff" }}
        >
          Copyright © 2026 Vision Hub
        </Typography>
      </Box>

      <Box p={2} sx={{ overflowY: "auto", height: "90vh", flex: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
            {selectedCategory} <span style={{ color: "#FC1503" }}>Videos</span>
          </Typography>

          {recommendationContext && (
            <Chip
              icon={<AutoAwesomeIcon style={{ color: "#FFD700" }} />}
              label={recommendationContext}
              variant="outlined"
              sx={{ color: "#aaa", borderColor: "#3d3d3d", fontSize: "12px" }}
            />
          )}
        </Stack>

        <Videos videos={videos} />
      </Box>
    </Stack>
  );
};

export default Feed;
