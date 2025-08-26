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
import { parseAsString, useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/videos/$videoId")({
  component: RouteComponent,
  beforeLoad: () => ({
    layoutConfig: {
      isShowBottomNavbar: false,
    },
  }),
});

function RouteComponent() {
  const { videoId } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [activeEpisode, setActiveEpisode] = useQueryState(
    "episode",
    parseAsString.withDefault(""),
  );
  const [currentEpURL, setCurrentEpURL] = useState("");

  const { videoDetail, isLoading: isLoadingVideoDetail } = useGetVideoDetail({
    vodId: videoId,
  });

  const { videoRecommendList } = useGetVideoRecommend({ vod_id: videoId });

  const groupedEpisodes = useMemo(
    () => groupEpisodes(videoDetail?.vod_play_url ?? [], 10),
    [videoDetail?.vod_play_url],
  );

  const isExistingBookmark = useLiveQuery(() =>
    db.bookmarks.get(videoId || ""),
  );

  // Find current episode URL based on active episode
  const findEpisodeURL = useCallback(
    (episodeTitle: string) => {
      for (const season of groupedEpisodes) {
        const episode = season.episodes.find((ep) => ep.title === episodeTitle);
        if (episode) {
          return episode.url;
        }
      }
      return "";
    },
    [groupedEpisodes],
  );

  // Set initial episode when video detail loads
  useEffect(() => {
    if (!videoDetail || groupedEpisodes.length === 0) return;

    if (!activeEpisode) {
      // Set first episode as default
      const firstEpisode = groupedEpisodes[0]?.episodes[0];
      if (firstEpisode) {
        setActiveEpisode(firstEpisode.title ?? "");
        setCurrentEpURL(firstEpisode.url ?? "");
      }
    } else {
      // Update URL for existing active episode
      const episodeURL = findEpisodeURL(activeEpisode);
      setCurrentEpURL(episodeURL);
    }
  }, [
    videoDetail,
    groupedEpisodes,
    activeEpisode,
    setActiveEpisode,
    findEpisodeURL,
  ]);

  const handleVideoClick = useCallback(
    (video: VideoResponse) => {
      navigate({
        to: "/videos/$videoId",
        params: {
          videoId: video.vod_id ?? "",
        },
      });
    },
    [navigate],
  );

  const handleFavoriteClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      try {
        if (!isExistingBookmark) {
          await db.bookmarks.add({ id: videoId || "" });
        } else {
          await db.bookmarks.delete(videoId || "");
        }
      } catch (error) {
        console.error("Failed to toggle bookmark:", error);
      }
    },
    [isExistingBookmark, videoId],
  );

  const handleEpisodeSelect = useCallback(
    (episodeTitle: string) => {
      setActiveEpisode(episodeTitle);
      const episodeURL = findEpisodeURL(episodeTitle);
      setCurrentEpURL(episodeURL);
    },
    [setActiveEpisode, findEpisodeURL],
  );

  const renderFavoriteButton = () => (
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
  );

  const renderVideoContent = () => {
    if (!videoDetail) return null;

    return (
      <div className="space-y-6 px-4">
        <VideoInfo videoDetail={videoDetail} />
        <GenresList vod_class={(videoDetail?.vod_class ?? "").split(",")} />
        <Overview vod_content={videoDetail?.vod_content} />

        <div className="space-y-2">
          {groupedEpisodes.map((season) => (
            <EpisodeAccordion
              key={season.id}
              seasonTitle={season.title}
              episodes={season.episodes}
              onEpisodeSelect={handleEpisodeSelect}
            />
          ))}
        </div>

        <section>
          <h2 className="font-semibold text-white">
            {t("pages.movies.movieDetails.relatedMovies")}
          </h2>
          <RelatedMovies
            movies={videoRecommendList ?? []}
            onMovieClick={handleVideoClick}
          />
        </section>
      </div>
    );
  };

  if (isLoadingVideoDetail || !currentEpURL) {
    return (
      <PageTransition direction="right">
        <div className="h-[calc(100vh-var(--nav-header-height))]">
          <Loading />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition direction="right">
      <NavHeader
        backRoute="back"
        title={t("pages.movies.movieDetails.title")}
        rightNode={renderFavoriteButton()}
      />

      <div className="lighter-scrollbar h-[calc(100vh-var(--nav-header-height))] space-y-6 overflow-y-auto">
        <VideoPlayer
          key={`${videoDetail?.vod_id}-${currentEpURL}`}
          id={videoDetail?.vod_id ?? ""}
          url={currentEpURL}
          poster={videoDetail?.vod_pic ?? PLACEHOLDER_IMAGE_HORIZONTAL}
        />
        {renderVideoContent()}
      </div>
    </PageTransition>
  );
}
