import React from "react";
import { Stack, Divider } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HistoryIcon from "@mui/icons-material/History";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import { categories } from "../utils/constants";

const PERSONALIZED_NAV = [
  { name: "Recommended", icon: <AutoAwesomeIcon /> },
  { name: "Watch History", icon: <HistoryIcon /> },
  { name: "Liked Videos", icon: <ThumbUpIcon /> },
  { name: "Saved Videos", icon: <BookmarkIcon /> },
];

const Categories = ({ selectedCategory, setSelectedCategory }) => (
  <Stack
    direction="row"
    sx={{
      overflowY: "auto",
      height: { sx: "auto", md: "95%" },
      flexDirection: { md: "column" },
    }}
  >
    {/* Personalized Nav Options */}
    {PERSONALIZED_NAV.map((nav) => (
      <button
        className="category-btn"
        onClick={() => setSelectedCategory(nav.name)}
        style={{
          background: nav.name === selectedCategory && "#FC1503",
          color: "white",
          fontWeight: nav.name === selectedCategory ? "bold" : "normal",
        }}
        key={nav.name}
      >
        <span style={{ color: nav.name === selectedCategory ? "white" : "#FC1503", marginRight: "15px" }}>
          {nav.icon}
        </span>
        <span style={{ opacity: nav.name === selectedCategory ? "1" : "0.9" }}>
          {nav.name}
        </span>
      </button>
    ))}

    <Divider sx={{ my: 1, borderColor: "#3d3d3d", display: { xs: "none", md: "block" } }} />

    {/* Standard Regional Categories */}
    {categories.map((category) => (
      <button
        className="category-btn"
        onClick={() => setSelectedCategory(category.name)}
        style={{
          background: category.name === selectedCategory && "#FC1503",
          color: "white",
        }}
        key={category.name}
      >
        <span style={{ color: category.name === selectedCategory ? "white" : "red", marginRight: "15px" }}>
          {category.icon}
        </span>
        <span style={{ opacity: category.name === selectedCategory ? "1" : "0.8" }}>
          {category.name}
        </span>
      </button>
    ))}
  </Stack>
);

export default Categories;
