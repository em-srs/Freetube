import { fetchFromAPI } from './fetchFromAPI';

// Formats ISO 8601 duration strings (e.g. PT1H2M30S, PT14M5S, PT45S) into YouTube format (1:02:30, 14:05, 0:45)
export const formatDuration = (isoDuration) => {
  if (!isoDuration) return null;
  if (isoDuration === 'P0D' || isoDuration === 'PT0S') return 'LIVE';

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;

  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);

  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (hours > 0) {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${minutes}:${formattedSeconds}`;
};

// Determines if a video is a YouTube Short (duration <= 60s or title contains #shorts)
export const isShortVideo = (isoDuration, title = '') => {
  if (/#shorts?|#short\b/i.test(title)) return true;
  if (!isoDuration) return false;

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return false;

  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds > 0 && totalSeconds <= 60;
};

// Batch fetches contentDetails (duration) and live status for a list of video items
export const enrichVideosWithDetails = async (videoList) => {
  if (!videoList || !Array.isArray(videoList) || videoList.length === 0) {
    return videoList;
  }

  // Extract video IDs from items that have videoId and missing contentDetails
  const videoIdsToFetch = videoList
    .filter(item => item?.id?.videoId && !item.contentDetails?.duration)
    .map(item => item.id.videoId);

  if (videoIdsToFetch.length === 0) {
    return videoList;
  }

  try {
    // YouTube API allows comma-separated IDs in a single batch request
    const idsParam = videoIdsToFetch.join(',');
    const detailsData = await fetchFromAPI(`videos?part=contentDetails,snippet&id=${idsParam}`);
    
    if (!detailsData?.items) return videoList;

    // Create a lookup map of id -> detail
    const detailsMap = new Map();
    detailsData.items.forEach(detail => {
      detailsMap.set(detail.id, detail);
    });

    // Merge contentDetails and liveBroadcastContent into original video items
    return videoList.map(item => {
      const vId = item?.id?.videoId;
      if (vId && detailsMap.has(vId)) {
        const detail = detailsMap.get(vId);
        return {
          ...item,
          contentDetails: detail.contentDetails,
          snippet: {
            ...item.snippet,
            liveBroadcastContent: detail.snippet?.liveBroadcastContent || item.snippet?.liveBroadcastContent,
          },
        };
      }
      return item;
    });
  } catch (err) {
    console.error('Error enriching video details:', err);
    return videoList;
  }
};
