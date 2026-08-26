import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

import { Videos, ChannelCard } from "./";
import { fetchFromAPI } from "../utils/fetchFromAPI";

const ChannelDetail = () => {
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchResults = async () => {
      const data = await fetchFromAPI(`channels?part=snippet&id=${id}`);
      setChannelDetail(data?.items?.[0]);

      const videosData = await fetchFromAPI(`search?channelId=${id}&part=snippet%2Cid&order=date`);
      setVideos(videosData?.items || []);
    };

    fetchResults();
  }, [id]);

  return (
    <Box minHeight="95vh" sx={{ backgroundColor: "#0A0C10" }}>
      <Box>
        <div
          style={{
            height: "220px",
            background: "linear-gradient(135deg, #FF1E42 0%, #12151E 60%, #0A0C10 100%)",
            zIndex: 10,
          }}
        />
        <ChannelCard channelDetail={channelDetail} marginTop="-110px" />
      </Box>
      <Box p={{ xs: 2, md: 4 }} width="100%">
        <Videos videos={videos} />
      </Box>
    </Box>
  );
};

export default ChannelDetail;
