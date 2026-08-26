import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { useParams } from "react-router-dom";

import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos } from "./";

const SearchFeed = () => {
  const [videos, setVideos] = useState(null);
  const { searchTerm } = useParams();

  useEffect(() => {
    fetchFromAPI(`search?part=snippet&q=${searchTerm}`)
      .then((data) => setVideos(data.items || []));
  }, [searchTerm]);

  return (
    <Box p={{ xs: 2, md: 4 }} minHeight="95vh" sx={{ backgroundColor: "#0A0C10" }}>
      <Typography
        variant="h4"
        fontWeight="800"
        color="white"
        mb={3}
        sx={{ fontSize: { xs: "20px", md: "26px" }, letterSpacing: "-0.5px" }}
      >
        Search Results for <span style={{ color: "#FF1E42" }}>"{searchTerm}"</span>
      </Typography>
      <Box width="100%">
        <Videos videos={videos} />
      </Box>
    </Box>
  );
};

export default SearchFeed;
