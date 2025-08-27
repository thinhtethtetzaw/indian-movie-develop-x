import { useGetPopularSearch } from "@/apis/app/queryGetPopularSearch";
import Loading from "@/components/common/Loading";
import VideoCard, { VideoCardSkeleton } from "@/components/common/VideoCard";
import { Button } from "@/components/ui/button";
import type { VideoResponse } from "@/types/api-schema/response";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

function PopularSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    videoList,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetPopularSearch({});

  function onVideoClick(video: VideoResponse) {
    navigate({
      to: `/videos/${video.vod_id}`,
    });
  }

  if (isLoading) {
    return <PopularSearchSkeleton />;
  }

  return (
    <div className="space-y-4 px-4">
      <h2 className="text-forground font-semibold">
        {t("common.popularSearches")}
      </h2>
      <div className="grid grid-cols-3 gap-x-3 gap-y-6">
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
      {isFetchingNextPage ? (
        <div className="py-10">
          <Loading />
        </div>
      ) : (
        <Button
          variant="default"
          className="text-forground w-full bg-white/10 py-6 hover:bg-white/20"
          onClick={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
        >
          {t("common.viewMore")}
          <ChevronDownIcon />
        </Button>
      )}
    </div>
  );
}

const PopularSearchSkeleton = () => (
  <div className="grid grid-cols-3 gap-x-3 gap-y-6 px-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="flex-shrink-0">
        <VideoCardSkeleton index={index} />
      </div>
    ))}
  </div>
);

export default PopularSearch;
