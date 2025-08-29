import { useGetPopularSearch } from "@/apis/app/queryGetPopularSearch";
import VideoCard, { VideoCardSkeleton } from "@/components/common/VideoCard";
import { Button } from "@/components/ui/button";
import type { VideoResponse } from "@/types/api-schema/response";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const PER_PAGE = 15;

function PopularSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    videoList,
    isLoading,
    currentPage,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetPopularSearch({
    per_page: PER_PAGE,
  });

  function onVideoClick(video: VideoResponse) {
    navigate({
      to: `/videos/${video.vod_id}`,
    });
  }

  if (isLoading) {
    return (
      <div className="px-4">
        <PopularSearchSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4">
      <h2 className="text-forground font-semibold">
        {t("common.popularSearches")}
      </h2>
      <div className="2xs:grid-cols-3 grid grid-cols-2 gap-x-3 gap-y-6">
        {videoList &&
          videoList.length > 0 &&
          videoList.map((video, index) => (
            <div key={video?.vod_id} className="flex-shrink-0">
              {video && (
                <VideoCard
                  video={video}
                  onClick={onVideoClick}
                  index={
                    currentPage && currentPage > 1
                      ? index - (currentPage - 1) * PER_PAGE
                      : index
                  }
                  className="w-full"
                />
              )}
            </div>
          ))}
      </div>
      {isFetchingNextPage ? (
        <PopularSearchSkeleton />
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
  <div className="2xs:grid-cols-3 grid grid-cols-2 gap-x-3 gap-y-6">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex-shrink-0">
        <VideoCardSkeleton index={index} />
      </div>
    ))}
  </div>
);

export default PopularSearch;
