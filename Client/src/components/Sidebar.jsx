import React from "react";
import { Stack } from "@mui/material";

import { categories } from "../utils/constants";

const Categories = ({ selectedCategory, setSelectedCategory }) => (
  <Stack
    direction="row"
    sx={{
      overflowX: "auto",
      overflowY: { md: "auto" },
      height: { sx: "auto", md: "92%" },
      flexDirection: { md: "column" },
      px: { xs: 1, md: 0 },
      py: 1,
      gap: 0.5,
    }}
  >
    {categories.map((category) => {
      const isSelected = category.name === selectedCategory;
      return (
        <button
          className={`category-btn ${isSelected ? "active" : ""}`}
          onClick={() => setSelectedCategory(category.name)}
          key={category.name}
        >
          <span
            style={{
              color: isSelected ? "#ffffff" : "#FF1E42",
              marginRight: "14px",
              display: "flex",
              alignItems: "center",
              fontSize: "18px",
            }}
          >
            {category.icon}
          </span>
          <span style={{ fontSize: "13px" }}>{category.name}</span>
        </button>
      );
    })}
  </Stack>
);

export default Categories;
