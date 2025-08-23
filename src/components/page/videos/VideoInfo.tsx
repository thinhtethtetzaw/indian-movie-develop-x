import type { VideoResponse } from "@/types/api-schema/response";
import { Star } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface VideoInfoProps {
  videoDetail: VideoResponse;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ videoDetail }) => {
  const { vod_name, vod_score, vod_lang, vod_actor, vod_director, vod_year } =
    videoDetail;
  const { t } = useTranslation();

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-lg font-bold">
          {vod_name} ({vod_year})
        </h1>
        <div className="mt-2 flex-col space-y-6">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{vod_score}</span>
          </div>
          <div className="space-y-2 space-x-1">
            <p className="text-sm">
              {t("pages.movies.movieDetails.subtitle")}:
              <span className="ml-2 text-gray-400">{vod_lang}</span>
            </p>
            <p className="text-sm">
              {t("pages.movies.movieDetails.director")}:
              <span className="ml-2 text-gray-400">{vod_director}</span>
            </p>
            <p className="text-sm">
              {t("pages.movies.movieDetails.actors")}:
              <span className="ml-2 text-gray-400">{vod_actor}</span>
            </p>
            <p className="text-sm">
              {t("pages.movies.movieDetails.releaseDate")}:
              <span className="ml-2 text-gray-400">{vod_year}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
