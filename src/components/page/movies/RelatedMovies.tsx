import VideoCard from "@/components/common/VideoCard";
import type { VideoResponse } from "@/types/api-schema/response";
import React from "react";

interface Props {
  videos: VideoResponse[];
  onVideoClick?: (video: VideoResponse) => void;
  title: string;
}

const RelatedVideos: React.FC<Props> = ({ videos, onVideoClick, title }) => {
  return (
    <section className="space-y-4">
      <h2 className="font-semibold text-white">{title}</h2>
      <div className="scrollbar-hide grid grid-cols-3 gap-3">
        {videos.map((video) => (
          <div key={video.vod_id} className="flex-shrink-0">
            <VideoCard video={video} onClick={() => onVideoClick?.(video)} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedVideos;
