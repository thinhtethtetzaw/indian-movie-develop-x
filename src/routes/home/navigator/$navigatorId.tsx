import { useGetVideoListByNavigatorId } from "@/apis/app/queryGetVideoListByNavigatorId";
import NavHeader from "@/components/common/layouts/NavHeader";
import VideoCard, { VideoCardSkeleton } from "@/components/common/VideoCard";
import { Skeleton } from "@/components/ui/skeleton";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import type { VideoResponse } from "@/types/api-schema/response";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";

export const Route = createFileRoute("/home/navigator/$navigatorId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigatorId } = Route.useParams();
  const {
    pageTitle,
    videoList,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetVideoListByNavigatorId({
    navigatorId,
  });

  const { scrollRooms, viewportRef } = useInfiniteScroll({
    hasNextPage: hasNextPage,
    isFetchingNextPage: isFetchingNextPage,
    fetchNextPage: fetchNextPage,
    checkPosition: "bottom",
  });

  const renderVideoCardSkeleton = useCallback(
    (index: number) => <VideoCardSkeleton index={index} />,
    [],
  );

  function handleVideoClick(video: VideoResponse) {
    console.log("Video clicked:", video);
  }

  if (isPending)
    return (
      <>
        <Skeleton className="h-[var(--nav-header-height)] w-full rounded-none" />
        <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-6 px-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex-shrink-0">
              {renderVideoCardSkeleton(index)}
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
        title={pageTitle || ""}
      />

      <section
        onScroll={scrollRooms}
        ref={viewportRef}
        className="lighter-scrollbar h-[calc(100vh-var(--nav-header-height)-var(--bottom-nav-height))] space-y-4 overflow-y-auto px-4 pb-5"
      >
        <div className="grid grid-cols-3 gap-x-3 gap-y-6">
          {videoList?.map(
            (video, index) =>
              !!video && (
                <div key={video.vod_id} className="flex-shrink-0">
                  <VideoCard
                    video={video}
                    onClick={handleVideoClick}
                    index={index}
                  />
                </div>
              ),
          )}
          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex-shrink-0">
                {renderVideoCardSkeleton(index)}
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
