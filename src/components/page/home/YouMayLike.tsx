import { useGetRecommendVideos } from "@/apis/app/queryGetRecommendVideos";
import VideoCard, { VideoCardSkeleton } from "@/components/common/VideoCard";
import { Button } from "@/components/ui/button";
import type { VideoResponse } from "@/types/api-schema/response";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  title?: string;
};

function YouMayLike({ title }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { videoList, isLoading } = useGetRecommendVideos({
    per_page: 12,
  });

  function onVideoClick(video: VideoResponse) {
    navigate({
      to: `/videos/${video.vod_id}`,
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <YouMayLikeSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!!title && <h2 className="text-forground font-semibold">{title}</h2>}
      <div className="2xs:grid-cols-3 grid grid-cols-2 gap-x-3 gap-y-6">
        {videoList &&
          videoList.length > 0 &&
          videoList.map((video, index) => (
            <div key={video?.vod_id} className="flex-shrink-0">
              {video && (
                <VideoCard
                  video={video}
                  onClick={onVideoClick}
                  index={index}
                  className="w-full"
                />
              )}
            </div>
          ))}
      </div>
      <Button
        variant="default"
        className="text-forground w-full bg-white/10 py-6 hover:bg-white/20"
        onClick={() => {
          navigate({
            to: "/home/recommended-videos",
          });
        }}
      >
        {t("common.viewMore")}
        <ChevronRightIcon />
      </Button>
    </div>
  );
}

const YouMayLikeSkeleton = () => (
  <div className="2xs:grid-cols-3 grid grid-cols-2 gap-x-3 gap-y-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="flex-shrink-0">
        <VideoCardSkeleton index={index} />
      </div>
    ))}
  </div>
);

export default YouMayLike;
