import React, { useEffect, useState, useCallback } from "react";
import { Box, Stack, Typography, Button, ToggleButtonGroup, ToggleButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import BoltIcon from "@mui/icons-material/Bolt";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PublicIcon from "@mui/icons-material/Public";

import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos, Sidebar } from "./";

const categoryKeywords = {
  "New": ["New videos", "Trending videos 2026", "Viral content", "Latest uploads", "Popular Youtube videos"],
  "Shorts": ["YouTube Shorts viral", "Trending Shorts 2026", "Funny Shorts", "Tech Shorts", "Gaming Shorts", "Coding Shorts"],
  "Coding": ["Coding tutorials", "Web Development", "JavaScript React", "Python programming", "Software engineering", "Full stack development"],
  "Gaming": ["Gaming highlights", "Live gaming", "Gameplay 2026", "Top games", "Esports matches"],
  "Music": ["Top Music Hits 2026", "Trending Songs", "Live concerts", "Official Music Videos", "Acoustic covers"],
  "News": ["World news today", "Breaking news live", "Tech news", "Daily headlines", "Global news"],
  "Movies": ["Movie trailers 2026", "Action movies full", "Cinema highlights", "Behind the scenes movies", "Blockbuster trailers"],
  "Podcasts": ["Popular podcasts", "Tech podcasts", "Developer podcast", "Comedy podcasts", "Inspirational interviews"],
  "Sports": ["Sports highlights", "Football highlights", "Basketball best plays", "Extreme sports", "Match recaps"],
  "Live": ["Live streams", "Live gaming", "Live music", "Live podcast", "Live news broadcast"],
  "Comedy": ["Standup comedy", "Funny sketches", "Comedy clips", "Hilarious moments", "Try not to laugh"],
  "Fitness": ["Workout routine", "Full body workout", "Gym motivation", "Fitness tips", "HIIT workout"],
  "Learning": ["Interesting facts", "Science explained", "Educational documentaries", "How things work", "History explained"],
  "Fashion": ["Fashion trends 2026", "Style guide", "Outfits of the week", "Runway fashion", "Streetwear lookbook"],
  "Beauty": ["Makeup tutorial", "Skincare routine", "Beauty tips", "Glow up guide", "Hair styling tutorial"],
  "CryptoCurrency": ["Crypto news", "Bitcoin update", "Ethereum news", "Web3 development", "Blockchain explained"],
  "Shopping": ["Tech unboxing", "Product review", "Budget tech haul", "Best gadgets 2026", "Amazon haul"],
  "Education": ["Physics tutorial", "Math shortcuts", "Coding for beginners", "Language learning", "Study tips"],
};

const getRandomQuery = (category) => {
  const pool = categoryKeywords[category] || [category];
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [feedFilter, setFeedFilter] = useState("videos"); // "videos" | "shorts" | "all"
  const [videos, setVideos] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCategoryFeed = useCallback((category, filter) => {
    setVideos(null);
    setIsRefreshing(true);

    let query = getRandomQuery(category);
    if (category === "Shorts" || filter === "shorts") {
      if (!query.toLowerCase().includes("shorts")) {
        query = `#shorts ${query}`;
      }
    }

    const orders = ['relevance', 'date', 'rating'];
    const randomOrder = orders[Math.floor(Math.random() * orders.length)];

    let endpoint = `search?part=snippet&type=video&q=${encodeURIComponent(query)}`;
    if (category === "Shorts" || filter === "shorts") {
      endpoint += `&videoDuration=short`;
    } else if (filter === "videos") {
      endpoint += `&videoDuration=medium`;
    }

    fetchFromAPI(endpoint, { order: randomOrder })
      .then((data) => {
        let items = data.items || [];

        // Apply client-side filter
        let filteredItems = items;
        if (filter === "videos" && category !== "Shorts") {
          // Exclude title with #shorts or shorts tag
          filteredItems = items.filter(item => !/#shorts?|#short\b/i.test(item.snippet?.title || ""));
        } else if (filter === "shorts" || category === "Shorts") {
          // Ensure items match shorts query or stay in shorts view
          filteredItems = items.filter(item => item.id?.videoId);
        }

        // Fallback to original items if filter yields 0 items
        if (filteredItems.length === 0 && items.length > 0) {
          filteredItems = items;
        }

        // Fisher-Yates light shuffle
        filteredItems = [...filteredItems].sort(() => Math.random() - 0.5);
        setVideos(filteredItems);
      })
      .catch((err) => {
        console.error("Error fetching feed:", err);
        setVideos([]);
      })
      .finally(() => setIsRefreshing(false));
  }, []);

  useEffect(() => {
    const currentFilter = selectedCategory === "Shorts" ? "shorts" : feedFilter;
    if (selectedCategory === "Shorts" && feedFilter !== "shorts") {
      setFeedFilter("shorts");
    }
    fetchCategoryFeed(selectedCategory, currentFilter);
  }, [selectedCategory, feedFilter, fetchCategoryFeed]);

  const handleRefresh = () => {
    fetchCategoryFeed(selectedCategory, feedFilter);
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFeedFilter(newFilter);
      if (newFilter === "shorts" && selectedCategory !== "Shorts") {
        // Keep category or keep context
      } else if (newFilter !== "shorts" && selectedCategory === "Shorts") {
        setSelectedCategory("New");
      }
    }
  };

  const isShortsView = selectedCategory === "Shorts" || feedFilter === "shorts";

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Typography
            variant="h4"
            fontWeight="800"
            sx={{
              color: "white",
              fontSize: { xs: "22px", md: "28px" },
              letterSpacing: "-0.5px",
            }}
          >
            {selectedCategory} <span style={{ color: "#FF1E42" }}>{isShortsView ? "Shorts ⚡" : "Videos"}</span>
          </Typography>

          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            {/* Feed Type Filter Buttons */}
            <ToggleButtonGroup
              value={feedFilter}
              exclusive
              onChange={handleFilterChange}
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                p: "3px",
                "& .MuiToggleButton-root": {
                  color: "#94A3B8",
                  border: "none",
                  borderRadius: "16px",
                  px: 2,
                  py: 0.5,
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "none",
                  "&.Mui-selected": {
                    backgroundColor: "linear-gradient(135deg, #ff1e42 0%, #ff523b 100%)",
                    background: "#FF1E42",
                    color: "#FFFFFF",
                    boxShadow: "0 2px 10px rgba(255, 30, 66, 0.3)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    color: "#FFFFFF",
                  },
                },
              }}
            >
              <ToggleButton value="videos">
                <OndemandVideoIcon sx={{ fontSize: "14px", mr: 0.5 }} /> Main Videos
              </ToggleButton>
              <ToggleButton value="shorts">
                <BoltIcon sx={{ fontSize: "14px", mr: 0.5, color: feedFilter === "shorts" ? "#fff" : "#FF1E42" }} /> Shorts
              </ToggleButton>
              <ToggleButton value="all">
                <PublicIcon sx={{ fontSize: "14px", mr: 0.5 }} /> All
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              startIcon={<RefreshIcon className={isRefreshing ? "spin-icon" : ""} />}
              sx={{
                backgroundColor: "rgba(255, 30, 66, 0.12)",
                color: "#FF1E42",
                border: "1px solid rgba(255, 30, 66, 0.3)",
                borderRadius: "20px",
                px: 2.5,
                py: 0.8,
                fontSize: "13px",
                fontWeight: 700,
                textTransform: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#FF1E42",
                  color: "#FFFFFF",
                  boxShadow: "0 0 16px rgba(255, 30, 66, 0.4)",
                },
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        <Videos videos={videos} isShortsFeed={isShortsView} />
      </Box>
    </Stack>
  );
};

export default Feed;
