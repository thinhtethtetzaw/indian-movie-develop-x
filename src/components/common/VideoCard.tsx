import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { COMMON_ANIMATION_CONFIG } from "@/config/animation";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import type { VideoResponse } from "@/types/api-schema/response";
import { useLiveQuery } from "dexie-react-hooks";
import { HeartIcon, Star } from "lucide-react";
import { motion } from "motion/react";
import React, { useCallback, useMemo } from "react";
import { toast } from "sonner";

interface VideoCardProps {
  video: VideoResponse;
  onClick?: (video: VideoResponse) => void;
  className?: string;
  showFavoriteButton?: boolean;
  index?: number;
}

// Constants
const PLACEHOLDER_IMAGE =
  "https://placehold.co/300x450/2B2B2B/FFF?text=No+Preview";
export const VIDEO_CARD_ANIMATION_DELAY_MULTIPLIER = 0.02;

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onClick,
  className,
  showFavoriteButton = true,
  index = 0,
}) => {
  const isExistingBookmark = useLiveQuery(() =>
    db.bookmarks.get(video.vod_id || ""),
  );

  const handleFavoriteClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      try {
        const totalBookmarks = await db.bookmarks.count();
        if (totalBookmarks >= 100) {
          toast.error("You have reached the maximum number of bookmarks");
          return;
        }

        if (!isExistingBookmark) {
          await db.bookmarks.add({
            id: video.vod_id || "",
          });
        } else {
          await db.bookmarks.delete(video.vod_id || "");
        }
      } catch (error) {
        console.error("Failed to toggle bookmark:", error);
      }
    },
    [isExistingBookmark, video.vod_id],
  );

  const handleCardClick = useCallback(() => {
    onClick?.(video);
  }, [onClick, video]);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = PLACEHOLDER_IMAGE;
    },
    [],
  );

  // Memoized computed values
  const animationDelay = useMemo(
    () => index * VIDEO_CARD_ANIMATION_DELAY_MULTIPLIER,
    [index],
  );

  const hasRatingOrEpisode = useMemo(
    () => Boolean(video.vod_score || video.vod_sub),
    [video.vod_score, video.vod_sub],
  );

  const heartIconClassName = useMemo(
    () =>
      cn(
        "size-4 transition-all",
        isExistingBookmark
          ? "fill-red-500 text-red-500"
          : "text-forground hover:text-red-400",
      ),
    [isExistingBookmark],
  );

  // Render functions
  const renderRating = () => {
    if (!hasRatingOrEpisode) return null;

    return (
      <div className="absolute bottom-2 left-2 space-y-1">
        {video.vod_score && (
          <div className="flex items-center gap-1">
            <span className="text-forground text-xs font-medium">
              {Number(video.vod_score).toFixed(1)}
            </span>
            <Star className="text-forground h-3 w-3 fill-white" />
          </div>
        )}
        {/* {video.episode && (
          <div className="text-forground flex items-center gap-1 text-xs font-medium">
            <span>{video.episode}</span>
            <span>Episode</span>
          </div>
        )} */}
      </div>
    );
  };

  const renderFavoriteButton = () => {
    if (!showFavoriteButton) return null;

    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.01 }}
        transition={{
          type: "tween",
          duration: 0.15,
          ease: "easeOut",
        }}
        className="absolute top-1 right-1"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 size-8 rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-black/40"
          onClick={handleFavoriteClick}
          aria-label={
            isExistingBookmark ? "Remove from favorites" : "Add to favorites"
          }
        >
          <motion.div
            animate={{
              scale: isExistingBookmark ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <HeartIcon className={heartIconClassName} />
          </motion.div>
        </Button>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={COMMON_ANIMATION_CONFIG.videoCard.initial}
      animate={COMMON_ANIMATION_CONFIG.videoCard.animate}
      exit={COMMON_ANIMATION_CONFIG.videoCard.exit}
      transition={{
        ...COMMON_ANIMATION_CONFIG.videoCard.transition,
        delay: animationDelay,
      }}
      className={cn("min-h-46 w-31", className, {
        "cursor-pointer": !!onClick,
      })}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="relative overflow-hidden rounded-sm">
        <img
          src={video.vod_pic || PLACEHOLDER_IMAGE}
          alt={video.vod_name || "Video"}
          className="h-40 w-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 from-10% via-black/20 via-30% to-transparent to-50%" />

        {renderFavoriteButton()}
        {renderRating()}
      </div>

      <h3 className="text-forground mt-1.5 truncate text-sm font-semibold">
        {video.vod_name || "Untitled"}
      </h3>
    </motion.div>
  );
};

const VideoCardSkeleton = ({
  className,
  index = 0,
}: {
  className?: string;
  index?: number;
}) => (
  <motion.div
    initial={COMMON_ANIMATION_CONFIG.videoCard.initial}
    animate={COMMON_ANIMATION_CONFIG.videoCard.animate}
    exit={COMMON_ANIMATION_CONFIG.videoCard.exit}
    transition={{
      ...COMMON_ANIMATION_CONFIG.videoCard.transition,
      delay: index * VIDEO_CARD_ANIMATION_DELAY_MULTIPLIER,
    }}
    className={cn("min-h-46 w-full min-w-31", className)}
  >
    <Skeleton className="h-40 w-full" />
    <Skeleton className="mt-1.5 h-6 w-3/4" />
  </motion.div>
);

export default VideoCard;
export { VideoCardSkeleton };
