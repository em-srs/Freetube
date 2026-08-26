import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Typography, Box, Stack, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

import { Videos, Loader } from "./";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import {
  trackVideoView,
  toggleLikeVideo,
  isVideoLiked,
  toggleSaveVideo,
  isVideoSaved,
} from "../utils/recommendationEngine";

const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
      .then((data) => {
        const detail = data.items[0];
        setVideoDetail(detail);
        if (detail) {
          trackVideoView(detail);
        }
      });

    fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
      .then((data) => setVideos(data.items));

    setLiked(isVideoLiked(id));
    setSaved(isVideoSaved(id));
  }, [id]);

  const handleLike = () => {
    if (videoDetail) {
      const isNowLiked = toggleLikeVideo(videoDetail);
      setLiked(isNowLiked);
    }
  };

  const handleSave = () => {
    if (videoDetail) {
      const isNowSaved = toggleSaveVideo(videoDetail);
      setSaved(isNowSaved);
    }
  };

  if(!videoDetail?.snippet) return <Loader />;

  const { snippet: { title, channelId, channelTitle }, statistics: { viewCount } } = videoDetail;

  return (
    <Box minHeight="95vh">
      <Stack direction={{ xs: "column", md: "row" }}>
        <Box flex={1}>
          <Box sx={{ width: "100%", position: "sticky", top: "86px" }}>
            <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`} className="react-player" controls />
            <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
              {title}
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ color: "#fff" }} py={1} px={2} flexWrap="wrap" gap={1}>
              <Link to={`/channel/${channelId}`}>
                <Typography variant={{ sm: "subtitle1", md: 'h6' }} color="#fff">
                  {channelTitle}
                  <CheckCircleIcon sx={{ fontSize: "12px", color: "gray", ml: "5px" }} />
                </Typography>
              </Link>

              <Stack direction="row" gap="12px" alignItems="center">
                <Button
                  startIcon={liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                  onClick={handleLike}
                  sx={{
                    color: liked ? "#FC1503" : "#fff",
                    backgroundColor: "#272727",
                    borderRadius: "20px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#3d3d3d" },
                  }}
                >
                  {liked ? "Liked" : "Like"}
                </Button>

                <Button
                  startIcon={saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  onClick={handleSave}
                  sx={{
                    color: saved ? "#4caf50" : "#fff",
                    backgroundColor: "#272727",
                    borderRadius: "20px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#3d3d3d" },
                  }}
                >
                  {saved ? "Saved" : "Watch Later"}
                </Button>

                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {parseInt(viewCount || 0).toLocaleString()} views
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
        <Box px={2} py={{ md: 1, xs: 5 }} justifyContent="center" alignItems="center">
          <Videos videos={videos} direction="column" />
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;
