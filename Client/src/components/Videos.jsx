import React, { useState, useEffect } from "react";
import { Stack, Box } from "@mui/material";

import { ChannelCard, Loader, VideoCard } from "./";
import { enrichVideosWithDetails } from "../utils/formatDuration";

const Videos = ({ videos, direction }) => {
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

  if (!enrichedVideos?.length) return <Loader />;
  
  if (direction === "column") {
    return (
      <Stack direction="column" gap={2} width="100%">
        {enrichedVideos.map((item, idx) => (
          <Box key={idx} width="100%">
            {item.id?.videoId && <VideoCard video={item} />}
            {item.id?.channelId && <ChannelCard channelDetail={item} />}
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <div className="videos-grid">
      {enrichedVideos.map((item, idx) => (
        <Box key={idx} width="100%">
          {item.id?.videoId && <VideoCard video={item} />}
          {item.id?.channelId && <ChannelCard channelDetail={item} />}
        </Box>
      ))}
    </div>
  );
};

export default Videos;
