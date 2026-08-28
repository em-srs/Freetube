import React, { useState, useEffect } from "react";
import { Stack, Box, Typography } from "@mui/material";

import { ChannelCard, Loader, VideoCard } from "./";
import { enrichVideosWithDetails } from "../utils/formatDuration";

const Videos = ({ videos, direction, isShortsFeed }) => {
  const [enrichedVideos, setEnrichedVideos] = useState(videos);

  useEffect(() => {
    let isMounted = true;
    setEnrichedVideos(videos);

    if (videos?.length) {
      enrichVideosWithDetails(videos).then((enriched) => {
        if (isMounted && enriched) {
          setEnrichedVideos(enriched);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [videos]);

  if (videos === null) return <Loader />;

  if (!enrichedVideos?.length) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="40vh" gap={2}>
        <Typography variant="h6" color="#94A3B8" fontWeight="600" textAlign="center">
          No videos available at the moment. Try refreshing or switching categories!
        </Typography>
      </Box>
    );
  }
  
  if (direction === "column") {
    return (
      <Stack direction="column" gap={2} width="100%">
        {enrichedVideos.map((item, idx) => (
          <Box key={idx} width="100%">
            {item.id?.videoId && <VideoCard video={item} isShortsFeed={isShortsFeed} />}
            {item.id?.channelId && <ChannelCard channelDetail={item} />}
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <div className={isShortsFeed ? "shorts-grid" : "videos-grid"}>
      {enrichedVideos.map((item, idx) => (
        <Box key={idx} width="100%">
          {item.id?.videoId && <VideoCard video={item} isShortsFeed={isShortsFeed} />}
          {item.id?.channelId && <ChannelCard channelDetail={item} />}
        </Box>
      ))}
    </div>
  );
};

export default Videos;
