import React from "react";
import { Stack, Box } from "@mui/material";

import { ChannelCard, Loader, VideoCard } from "./";

const Videos = ({ videos, direction }) => {
  if (!videos?.length) return <Loader />;
  
  if (direction === "column") {
    return (
      <Stack direction="column" gap={2} width="100%">
        {videos.map((item, idx) => (
          <Box key={idx} width="100%">
            {item.id.videoId && <VideoCard video={item} />}
            {item.id.channelId && <ChannelCard channelDetail={item} />}
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <div className="videos-grid">
      {videos.map((item, idx) => (
        <Box key={idx} width="100%">
          {item.id.videoId && <VideoCard video={item} />}
          {item.id.channelId && <ChannelCard channelDetail={item} />}
        </Box>
      ))}
    </div>
  );
};

export default Videos;
