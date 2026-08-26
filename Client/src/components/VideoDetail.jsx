import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Typography, Box, Stack, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import { Videos, Loader } from "./";
import { fetchFromAPI } from "../utils/fetchFromAPI";

const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
      .then((data) => setVideoDetail(data.items?.[0]));

    fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
      .then((data) => setVideos(data.items || []));
  }, [id]);

  if (!videoDetail?.snippet) return <Loader />;

  const { snippet: { title, channelId, channelTitle }, statistics } = videoDetail;
  const viewCount = statistics?.viewCount;
  const likeCount = statistics?.likeCount;

  return (
    <Box minHeight="95vh" p={{ xs: 1.5, md: 3 }} sx={{ backgroundColor: "#0A0C10" }}>
      <Stack direction={{ xs: "column", md: "row" }} gap={3}>
        <Box flex={1}>
          {/* Prominent Always-Visible Video Name Header */}
          <Typography
            color="#FFFFFF"
            variant="h5"
            fontWeight="800"
            sx={{
              fontSize: { xs: "18px", sm: "22px", md: "24px" },
              lineHeight: 1.3,
              mb: 2,
              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </Typography>

          <Box className="player-container" sx={{ width: "100%", mb: 2 }}>
            <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`} className="react-player" controls playing />
          </Box>

          <Box
            p={2}
            sx={{
              backgroundColor: "#141722",
              borderRadius: "14px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ color: "#fff" }}
              flexWrap="wrap"
              gap={2}
            >
              <Link to={`/channel/${channelId}`}>
                <Typography variant="subtitle1" fontWeight="700" color="#FFFFFF" sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {channelTitle}
                  <CheckCircleIcon sx={{ fontSize: "15px", color: "#FF1E42" }} />
                </Typography>
              </Link>
              <Stack direction="row" gap={1.5} alignItems="center">
                {viewCount && (
                  <Chip
                    icon={<VisibilityIcon style={{ color: "#94A3B8", fontSize: "16px" }} />}
                    label={`${parseInt(viewCount).toLocaleString()} views`}
                    sx={{ backgroundColor: "#181C28", color: "#94A3B8", fontSize: "12px", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                )}
                {likeCount && (
                  <Chip
                    icon={<ThumbUpIcon style={{ color: "#FF1E42", fontSize: "14px" }} />}
                    label={`${parseInt(likeCount).toLocaleString()} likes`}
                    sx={{ backgroundColor: "#181C28", color: "#FFFFFF", fontSize: "12px", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>

        <Box px={1} py={{ md: 0, xs: 2 }} width={{ xs: "100%", md: "360px" }}>
          <Typography variant="h6" fontWeight="700" color="#FFFFFF" mb={2} sx={{ fontSize: "16px" }}>
            Up Next & Related
          </Typography>
          <Videos videos={videos} direction="column" />
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;
