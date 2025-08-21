import { Star } from "lucide-react";
import React from "react";
interface VideoInfoProps {
  title: string;
  year: number;
  month: string;
  rating: number;
  director: string;
  actors: string;
  releaseDate: string;
  labels: {
    director: string;
    actors: string;
    releaseDate: string;
  };
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  title,
  year,
  rating,
  director,
  actors,
  releaseDate,
  labels,
}) => {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h1 className="text-base font-bold">
          {title} ({year})
        </h1>
        <div className="mt-2 flex-col space-y-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-md">{rating.toFixed(1)}</span>
          </div>
          <div className="space-x-1">
            <p className="text-sm">
              {labels.director}:
              <span className="ml-2 text-gray-400">{director}</span>
            </p>
            <p className="text-sm">
              {labels.actors}:
              <span className="ml-2 text-gray-400">{actors}</span>
            </p>
            <p className="text-sm">
              {labels.releaseDate}:
              <span className="ml-2 text-gray-400">{releaseDate}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
