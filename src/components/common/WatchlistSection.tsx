import { COMMON_ANIMATION_CONFIG } from "@/config/animation";
import { PLACEHOLDER_IMAGE_HORIZONTAL } from "@/constants/common";
import type { WatchList } from "@/lib/db";
import { cn } from "@/lib/utils";
import type { VideoResponse } from "@/types/api-schema/response";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import SmartImage from "./SmartImage";

export const WISHLIST_ANIMATION_DELAY_MULTIPLIER = 0.05;

function WatchListSection({
  watchListFromIndexDB,
  watchListVideos,
  isIncludePaddings = true,
}: {
  watchListFromIndexDB: WatchList[];
  watchListVideos: VideoResponse[];
  isIncludePaddings?: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  async function handleVideoCLick(video: VideoResponse | undefined) {
    if (!video?.vod_id) return;

    navigate({
      to: "/videos/$videoId",
      params: {
        videoId: video.vod_id ?? "",
      },
    });
  }

  return (
    <div className="space-y-4">
      <h2
        className={cn("text-forground font-semibold", {
          "px-4": isIncludePaddings,
        })}
      >
        {t("common.continueWatching")}
      </h2>
      <div className="scrollbar-hide flex gap-3 overflow-x-auto">
        {watchListVideos?.map((video, index) => {
          const currentVideo = watchListFromIndexDB.find(
            (watchList) => watchList.id === video.vod_id,
          );
          const totalVideoTime = currentVideo?.duration ?? 0;
          const currentVideoTime = currentVideo?.play_head_in_sec ?? 0;

          const progress = () =>
            Number(((currentVideoTime / totalVideoTime) * 100).toFixed(2));

          return (
            <div
              key={video.vod_id}
              onClick={() => handleVideoCLick(video)}
              className={cn("flex-shrink-0 cursor-pointer", {
                "first:pl-4 last:pr-4": isIncludePaddings,
              })}
            >
              <motion.div
                key={index}
                initial={COMMON_ANIMATION_CONFIG.videoCard.initial}
                animate={COMMON_ANIMATION_CONFIG.videoCard.animate}
                transition={{
                  ...COMMON_ANIMATION_CONFIG.videoCard.transition,
                  delay: index * WISHLIST_ANIMATION_DELAY_MULTIPLIER,
                }}
                className="w-44 space-y-1"
              >
                <div className="relative aspect-video w-44 overflow-hidden rounded-lg">
                  <SmartImage
                    src={video?.vod_pic}
                    alt={video?.vod_name}
                    className="h-full w-full object-cover"
                    fallback={PLACEHOLDER_IMAGE_HORIZONTAL}
                  />
                  <Progress
                    className="absolute bottom-0 h-1 rounded-none"
                    value={progress()}
                  />
                </div>
                <h3 className="text-forground mt-1.5 truncate text-sm font-semibold">
                  {video.vod_name || "Untitled"}
                </h3>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const WatchListSectionSkeleton = () => {
  return (
    <section className="space-y-4">
      <Skeleton className="mx-4 h-6 w-32" />
      <div className="scrollbar-hide flex gap-3 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            initial={COMMON_ANIMATION_CONFIG.videoCard.initial}
            animate={COMMON_ANIMATION_CONFIG.videoCard.animate}
            transition={{
              ...COMMON_ANIMATION_CONFIG.videoCard.transition,
              delay: index * WISHLIST_ANIMATION_DELAY_MULTIPLIER,
            }}
            className="flex-shrink-0 cursor-pointer space-y-1 first:pl-4 last:pr-4"
          >
            <Skeleton className="aspect-video w-44 overflow-hidden rounded-lg" />
            <Skeleton className="mt-1.5 h-6 w-3/4" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export { WatchListSection, WatchListSectionSkeleton };
