import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { Typography, Box, Stack, Chip, Switch, FormControlLabel, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { Videos, Loader } from "./";
import { fetchFromAPI } from "../utils/fetchFromAPI";

const VideoDetail = () => {
  const navigate = useNavigate();
  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState(null);
  const [autoplay, setAutoplay] = useState(() => {
    const saved = localStorage.getItem("visionhub_autoplay");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [countdown, setCountdown] = useState(null);
  const timerRef = useRef(null);
  const { id } = useParams();

  // Find next video from related videos list (first item with a videoId)
  const nextVideoItem = videos?.find(
    (item) => item.id?.videoId && item.id.videoId !== id
  );

  useEffect(() => {
    setCountdown(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
      .then((data) => setVideoDetail(data.items?.[0]));

    fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
      .then((data) => setVideos(data.items || []));

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      if (nextVideoItem?.id?.videoId) {
        navigate(`/video/${nextVideoItem.id.videoId}`);
      }
      setCountdown(null);
      return;
    }

    timerRef.current = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown, nextVideoItem, navigate]);

  const handleAutoplayToggle = (e) => {
    const isChecked = e.target.checked;
    setAutoplay(isChecked);
    localStorage.setItem("visionhub_autoplay", JSON.stringify(isChecked));
    if (!isChecked && countdown !== null) {
      cancelAutoplay();
    }
  };

  const cancelAutoplay = () => {
    setCountdown(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const playNextVideoNow = () => {
    if (nextVideoItem?.id?.videoId) {
      cancelAutoplay();
      navigate(`/video/${nextVideoItem.id.videoId}`);
    }
  };

  const handleVideoEnded = () => {
    if (autoplay && nextVideoItem?.id?.videoId) {
      setCountdown(5);
    }
  };

  if (!videoDetail?.snippet) return <Loader />;

  const { snippet: { title, channelId, channelTitle }, statistics } = videoDetail;
  const viewCount = statistics?.viewCount;
  const likeCount = statistics?.likeCount;

  return (
    <Box minHeight="95vh" px={{ xs: 2, md: 4, lg: 6 }} py={3} sx={{ backgroundColor: "#0A0C10" }}>
      <Box sx={{ maxWidth: "1280px", mx: "auto" }}>
        {/* Always-Visible Video Header Title & Autoplay Toggle */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={2}>
          <Typography
            color="#FFFFFF"
            variant="h5"
            fontWeight="800"
            sx={{
              fontSize: { xs: "18px", sm: "22px", md: "24px" },
              lineHeight: 1.3,
              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={autoplay}
                onChange={handleAutoplayToggle}
                size="small"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#FF1E42",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#FF1E42",
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" fontWeight="600" sx={{ color: autoplay ? "#FFFFFF" : "#94A3B8" }}>
                Autoplay {autoplay ? "ON" : "OFF"}
              </Typography>
            }
          />
        </Stack>

        {/* Video Player Container */}
        <Box className="player-container" sx={{ width: "100%", mb: 2, position: "relative" }}>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${id}`}
            className="react-player"
            controls
            playing
            onEnded={handleVideoEnded}
          />

          {/* YouTube-style Autoplay Countdown Overlay */}
          {countdown !== null && nextVideoItem && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(10, 12, 16, 0.92)",
                backdropFilter: "blur(8px)",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 3,
                textAlign: "center",
                animation: "fadeIn 0.3s ease-out",
              }}
            >
              <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, mb: 1 }}>
                Up Next In {countdown}s
              </Typography>

              {/* Thumbnail Card Preview */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  gap: 2,
                  backgroundColor: "#181C28",
                  p: 2,
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  maxWidth: "520px",
                  width: "100%",
                  mb: 3,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                <Box
                  component="img"
                  src={nextVideoItem.snippet?.thumbnails?.high?.url || nextVideoItem.snippet?.thumbnails?.medium?.url}
                  alt={nextVideoItem.snippet?.title}
                  sx={{
                    width: { xs: "100%", sm: "160px" },
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <Box sx={{ textAlign: "left", flex: 1, overflow: "hidden" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="700"
                    color="#FFFFFF"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.3,
                      fontSize: "14px",
                      mb: 0.5,
                    }}
                  >
                    {nextVideoItem.snippet?.title}
                  </Typography>
                  <Typography variant="body2" color="#94A3B8" sx={{ fontSize: "12px" }}>
                    {nextVideoItem.snippet?.channelTitle}
                  </Typography>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  onClick={cancelAutoplay}
                  sx={{
                    color: "#FFFFFF",
                    borderColor: "rgba(255,255,255,0.2)",
                    borderRadius: "30px",
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#FFFFFF",
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  onClick={playNextVideoNow}
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    background: "linear-gradient(135deg, #ff1e42 0%, #ff523b 100%)",
                    color: "#FFFFFF",
                    borderRadius: "30px",
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "0 4px 20px rgba(255, 30, 66, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #e01838 0%, #e0442e 100%)",
                    },
                  }}
                >
                  Play Now
                </Button>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Channel Details & Views/Likes Bar */}
        <Box
          p={2}
          mb={4}
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

        {/* Up Next & Related Videos Displayed Below Video Player */}
        <Box mt={4}>
          <Typography variant="h6" fontWeight="800" color="#FFFFFF" mb={3} sx={{ fontSize: "20px" }}>
            Up Next & Related <span style={{ color: "#FF1E42" }}>Videos</span>
          </Typography>
          <Videos videos={videos} />
        </Box>
      </Box>
    </Box>
  );
};

export default VideoDetail;

