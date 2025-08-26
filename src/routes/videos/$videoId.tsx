import { useGetVideoRecommend } from "@/apis/app/queryGetDetailRecommendList";
import { useGetVideoDetail } from "@/apis/app/queryGetVideoDetail";
import NavHeader from "@/components/common/layouts/NavHeader";
import Loading from "@/components/common/Loading";
import PageTransition from "@/components/common/PageTransition";
import EpisodeAccordion from "@/components/page/videos/EpisodeAccordion";
import GenresList from "@/components/page/videos/GenresList";
import Overview from "@/components/page/videos/Overview";
import RelatedMovies from "@/components/page/videos/RelatedMovies";
import VideoInfo from "@/components/page/videos/VideoInfo";
import VideoPlayer from "@/components/page/videos/VideoPlayer";
import { Button } from "@/components/ui/button";
import { PLACEHOLDER_IMAGE_HORIZONTAL } from "@/constants/common";
import { db } from "@/lib/db";
import { groupEpisodes } from "@/lib/processEpisodes";
import type { VideoResponse } from "@/types/api-schema/response";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { HeartIcon } from "lucide-react";
import { motion } from "motion/react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
export const Route = createFileRoute("/videos/$videoId")({
  component: RouteComponent,
  beforeLoad: () => {
    return {
      layoutConfig: {
        isShowBottomNavbar: true,
      },
    };
  },
});

function RouteComponent() {
  const { videoId } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeEpisodeId] = useQueryState(
    "epId",
    parseAsInteger.withDefault(1),
  );

  const { videoDetail, isLoading: isLoadingVideoDetail } = useGetVideoDetail({
    vodId: videoId,
  });

  const groupedEpisodes = groupEpisodes(videoDetail?.vod_play_url ?? [], 10);
  const currentEpisodeUrl =
    groupedEpisodes[0]?.episodes?.find(
      (episode) => episode.id === activeEpisodeId,
    )?.url ?? "";

  const { videoRecommendList } = useGetVideoRecommend({ vod_id: videoId });

  const handleVideoClick = (video: VideoResponse) => {
    navigate({
      to: "/videos/$videoId",
      params: {
        videoId: video.vod_id ?? "",
      },
    });
  };

  const isExistingBookmark = useLiveQuery(() =>
    db.bookmarks.get(videoId || ""),
  );

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      if (!isExistingBookmark) {
        await db.bookmarks.add({
          id: videoId || "",
        });
      } else {
        await db.bookmarks.delete(videoId || "");
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return (
    <PageTransition direction="right">
      <NavHeader
        backRoute={"back"}
        title={t("pages.movies.movieDetails.title")}
        rightNode={
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-black/40"
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
              <HeartIcon
                className={`size-4 transition-all ${
                  isExistingBookmark
                    ? "fill-red-500 text-red-500"
                    : "text-forground hover:text-red-400"
                }`}
              />
            </motion.div>
          </Button>
        }
      />

      {!isLoadingVideoDetail ? (
        <div className="space-y-6">
          <VideoPlayer
            id={videoDetail?.vod_id ?? ""}
            url={currentEpisodeUrl}
            poster={videoDetail?.vod_pic ?? PLACEHOLDER_IMAGE_HORIZONTAL}
          />

          {videoDetail && (
            <div className="space-y-6 px-4">
              <VideoInfo videoDetail={videoDetail} />
              <GenresList
                vod_class={(videoDetail?.vod_class ?? "").split(",")}
              />
              <Overview vod_content={videoDetail?.vod_content} />
              <div className="space-y-2">
                {groupedEpisodes.map((season) => (
                  <EpisodeAccordion
                    key={season.id}
                    seasonTitle={season.title}
                    episodes={season.episodes}
                    onEpisodeSelect={(episodeId) =>
                      console.log(
                        `Selected season ${season.id}, episode ${episodeId}`,
                      )
                    }
                  />
                ))}
              </div>
              <>
                <h2 className="font-semibold text-white">
                  {t("pages.movies.movieDetails.relatedMovies")}
                </h2>

                <RelatedMovies
                  movies={videoRecommendList ?? []}
                  onMovieClick={handleVideoClick}
                />
              </>
            </div>
          )}
        </div>
      ) : (
        <div className="m-auto h-[calc(100vh-var(--nav-header-height)-var(--bottom-nav-height))]">
          <Loading />
        </div>
      )}
    </PageTransition>
  );
}
