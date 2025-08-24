import { useGetVideoListByNavigatorId } from "@/apis/app/queryGetVideoListByNavigatorId";
import NavHeader from "@/components/common/layouts/NavHeader";
import VideoCard, { VideoCardSkeleton } from "@/components/common/VideoCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { VideoResponse } from "@/types/api-schema/response";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";

export const Route = createFileRoute("/home/navigator/$navigatorId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigatorId } = Route.useParams();
  const { pageTitle, videoList, isPending } = useGetVideoListByNavigatorId({
    navigatorId,
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

      <section className="mt-5 space-y-4 px-4">
        <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
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
        </div>
      </section>
    </>
  );
}
