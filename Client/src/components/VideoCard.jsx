import React from 'react';
import { Link } from "react-router-dom"; 
import { Typography, Card, CardContent, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { demoThumbnailUrl, demoVideoUrl, demoVideoTitle, demoChannelUrl, demoChannelTitle } from "../utils/constants";
import { formatDuration } from "../utils/formatDuration";

const VideoCard = ({ video: { id: { videoId }, snippet, contentDetails } }) => {
  const isLive = snippet?.liveBroadcastContent === 'live';
  const durationText = formatDuration(contentDetails?.duration);

  return (
    <Card
      className="video-card animate-fade-in"
      sx={{
        width: "100%",
        boxShadow: "none",
        borderRadius: "14px",
        backgroundColor: "#141722",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link to={videoId ? `/video/${videoId}` : `/video/cV2gBU6hKfY` }>
        <Box className="thumbnail-wrapper">
          <img
            src={snippet?.thumbnails?.high?.url || snippet?.thumbnails?.medium?.url || demoThumbnailUrl}
            alt={snippet?.title}
            className="thumbnail-img"
            loading="lazy"
          />
          {isLive ? (
            <Box className="video-badge live-badge">
              LIVE
            </Box>
          ) : durationText ? (
            <Box className="video-badge duration-badge">
              {durationText}
            </Box>
          ) : null}
        </Box>
      </Link>

      <CardContent
        sx={{
          backgroundColor: "#141722",
          p: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justify: "space-between",
          "&:last-child": { pb: 2 },
        }}
      >
        <Link to={videoId ? `/video/${videoId}` : demoVideoUrl }>
          <Typography
            variant="subtitle1"
            fontWeight="700"
            color="#FFFFFF"
            sx={{
              fontSize: "14px",
              lineHeight: "1.4",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 1,
              transition: "color 0.2s ease",
              "&:hover": { color: "#FF1E42" },
            }}
          >
            {snippet?.title || demoVideoTitle}
          </Typography>
        </Link>

        <Link to={snippet?.channelId ? `/channel/${snippet?.channelId}` : demoChannelUrl}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "12px",
              color: "#94A3B8",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              "&:hover": { color: "#FFFFFF" },
            }}
          >
            {snippet?.channelTitle || demoChannelTitle}
            <CheckCircleIcon sx={{ fontSize: "13px", color: "#FF1E42" }} />
          </Typography>
        </Link>
      </CardContent>
    </Card>
  );
};

export default VideoCard;