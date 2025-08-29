import { useGetRecommendVideos } from "@/apis/app/queryGetRecommendVideos";
import NavHeader from "@/components/common/layouts/NavHeader";
import VideoCard, { VideoCardSkeleton } from "@/components/common/VideoCard";
import { Skeleton } from "@/components/ui/skeleton";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import type { VideoResponse } from "@/types/api-schema/response";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/home/recommended-videos")({
  component: RouteComponent,
});

const PER_PAGE = 15;

function RouteComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    videoList,
    isLoading,
    currentPage,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetRecommendVideos({
    per_page: PER_PAGE,
  });

  const { scrollRooms, viewportRef } = useInfiniteScroll({
    hasNextPage: hasNextPage,
    isFetchingNextPage: isFetchingNextPage,
    fetchNextPage: fetchNextPage,
    checkPosition: "bottom",
  });

  function onVideoClick(video: VideoResponse) {
    navigate({
      to: `/videos/${video.vod_id}`,
    });
  }

  if (isLoading)
    return (
      <>
        <Skeleton className="h-[var(--nav-header-height)] w-full rounded-none" />
        <div className="2xs:grid-cols-3 mt-5 grid grid-cols-2 gap-x-3 gap-y-6 px-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <VideoCardSkeleton index={index} />
            </div>
          ))}
        </div>
      </>
    );

  return (
    <>
      <NavHeader
        backRoute={{
          to: "/home",
        }}
        title={t("pages.home.youMayLike")}
      />

      <section
        onScroll={scrollRooms}
        ref={viewportRef}
        className="lighter-scrollbar h-[calc(100svh-var(--nav-header-height)-var(--bottom-nav-height))] space-y-4 overflow-y-auto px-4 pb-5"
      >
        <div className="space-y-4">
          <div className="2xs:grid-cols-3 grid grid-cols-2 gap-x-3 gap-y-6">
            {videoList &&
              videoList.length > 0 &&
              videoList.map((video, index) => (
                <div
                  key={`${video?.vod_id}-${index}`}
                  className="flex-shrink-0"
                >
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
            {isFetchingNextPage &&
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex-shrink-0">
                  <VideoCardSkeleton index={index} />
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
