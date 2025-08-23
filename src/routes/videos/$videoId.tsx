import { useGetHomeRecommendList } from "@/apis/app/queryGetHomeRecommendList";
import { useGetVideoDetail } from "@/apis/app/queryGetVideoDetail";
import NavHeader from "@/components/common/layouts/NavHeader";
import Loading from "@/components/common/Loading";
import EpisodeAccordion from "@/components/page/videos/EpisodeAccordion";
import GenresList from "@/components/page/videos/GenresList";
import Overview from "@/components/page/videos/Overview";
import RelatedMovies from "@/components/page/videos/RelatedMovies";
import VideoInfo from "@/components/page/videos/VideoInfo";
import VideoPlayer from "@/components/page/videos/VideoPlayer";
import { Button } from "@/components/ui/button";
import { processEpisodes } from "@/lib/processEpisodes";
import type { VideoResponse } from "@/types/api-schema/response";
import { createFileRoute } from "@tanstack/react-router";
import { HeartIcon } from "lucide-react";
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
  const { t } = useTranslation();
  const { videoDetail, isLoading: isLoadingVideoDetail } = useGetVideoDetail({
    vodId: videoId,
  });

  console.log("videoDetail", videoDetail);
  const episodes = processEpisodes(videoDetail?.vod_play_url ?? []);
  console.log("episodes", episodes);
  const firstEpisodeUrl = episodes[0]?.url ?? "";
  const MOCK_MOVIE = {
    seasons: [
      {
        id: 1,
        title: "Season 01",
        episodes: [
          { id: 1, title: "Episode 1", isActive: false },
          { id: 2, title: "Episode 2", isActive: false },
          { id: 3, title: "Episode 3", isActive: false },
        ],
      },
      {
        id: 2,
        title: "Season 02",
        episodes: [
          { id: 1, title: "Episode 1", isActive: true },
          { id: 2, title: "Episode 2", isActive: false },
          { id: 3, title: "Episode 3", isActive: false },
          { id: 4, title: "Episode 4", isActive: false },
          { id: 5, title: "Episode 5", isActive: false },
        ],
      },
      {
        id: 3,
        title: "Season 03",
        episodes: [
          { id: 1, title: "Episode 1", isActive: false },
          { id: 2, title: "Episode 2", isActive: false },
        ],
      },
    ],
    movies: [
      {
        id: "1",
        title: "Superman",
        imageUrl:
          "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
        rating: 4.0,
        episode: null,
        isFavorite: false,
      },
      {
        id: "2",
        title: "The Dark Knight",
        imageUrl:
          "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        rating: null,
        episode: 10,
        isFavorite: true,
      },
    ],
  };
  const { homeRecommendList } = useGetHomeRecommendList({});
  // console.log("homeRecommendList", homeRecommendList);
  const mergedMovies =
    homeRecommendList
      ?.filter((item) =>
        ["carousel", "topic", "list"].includes(item.type ?? ""),
      )
      .flatMap((item) => item.list ?? []) ?? [];

  const uniqueMovies: VideoResponse[] = Array.from(
    new Map(mergedMovies.map((m) => [m.vod_id, m])).values(),
  );

  return (
    <>
      <NavHeader
        isShowBack
        title={t("pages.movies.movieDetails.title")}
        rightNode={
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-black/40"
          >
            <HeartIcon className="size-4 fill-red-500 text-red-500 transition-all" />
          </Button>
        }
      />

      {!isLoadingVideoDetail ? (
        <div className="space-y-6">
          <VideoPlayer
            url={firstEpisodeUrl}
            poster={videoDetail?.vod_pic ?? ""}
          />

          {videoDetail && (
            <div className="space-y-6 px-4">
              <VideoInfo videoDetail={videoDetail} />
              <GenresList
                vod_class={(videoDetail?.vod_class ?? "").split(",")}
              />
              <Overview vod_content={videoDetail?.vod_content} />
              <div className="space-y-2">
                {MOCK_MOVIE.seasons.map((season) => (
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
                  movies={uniqueMovies}
                  onMovieClick={(movie) => console.log("Clicked:", movie)}
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
    </>
  );
}
