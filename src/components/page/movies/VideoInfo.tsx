import { Star } from "lucide-react";
import React from "react";
interface VideoInfoProps {
  vod_name?: string;
  vod_score?: string;
  vod_lang?: string;
  vod_actor?: string;
  vod_director?: string;
  vod_year?: string;
  labels: {
    subtitle: string;
    director: string;
    actors: string;
    releaseDate: string;
  };
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  vod_name,
  vod_score,
  vod_lang,
  vod_actor,
  vod_director,
  vod_year,
  labels,
}) => {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h1 className="text-base font-bold">
          {vod_name} ({vod_year})
        </h1>
        <div className="mt-2 flex-col space-y-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-md">{vod_score}</span>
          </div>
          <div className="space-y-3 space-x-1">
            <p className="text-sm">
              {labels.subtitle}:
              <span className="ml-2 text-gray-400">{vod_lang}</span>
            </p>
            <p className="text-sm">
              {labels.director}:
              <span className="ml-2 text-gray-400">{vod_director}</span>
            </p>
            <p className="text-sm">
              {labels.actors}:
              <span className="ml-2 text-gray-400">{vod_actor}</span>
            </p>
            <p className="text-sm">
              {labels.releaseDate}:
              <span className="ml-2 text-gray-400">{vod_year}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
