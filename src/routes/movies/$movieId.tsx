import { useGetVideoDetail } from "@/apis/app/queryGetVideoDetail";
import NavHeader from "@/components/common/layouts/NavHeader";
import EpisodeAccordion from "@/components/page/movies/EpisodeAccordion";
import GenresList from "@/components/page/movies/GenresList";
import Overview from "@/components/page/movies/Overview";
import RelatedMovies from "@/components/page/movies/RelatedMovies";
import VideoInfo from "@/components/page/movies/VideoInfo";
import VideoPlayer from "@/components/page/movies/VideoPlayer";
import { processEpisodes } from "@/lib/processEpisodes";
import type { HomeRecommendListResponseMovie } from "@/types/api-schema/response";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/movies/$movieId")({
  component: () => {
    const { movieId } = Route.useParams();
    console.log("movieId", movieId);
    const { t } = useTranslation();
    const { videoDetail } = useGetVideoDetail({ vodId: movieId });
    console.log("videoDetail", videoDetail);
    const episodes = processEpisodes(videoDetail?.vod_play_url ?? []);
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

    return (
      <>
        <NavHeader isShowBack title={t("pages.movies.movieDetails.title")} />
        <div className="space-y-6 p-4">
          <VideoPlayer
            url={firstEpisodeUrl}
            poster={videoDetail?.vod_pic ?? ""}
          />

          <VideoInfo
            vod_name={videoDetail?.vod_name}
            vod_score={videoDetail?.vod_score}
            vod_lang={videoDetail?.vod_lang}
            vod_actor={videoDetail?.vod_actor}
            vod_director={videoDetail?.vod_director}
            vod_year={videoDetail?.vod_year}
            labels={{
              subtitle: t("pages.movies.movieDetails.subtitle"),
              director: t("pages.movies.movieDetails.director"),
              actors: t("pages.movies.movieDetails.actors"),
              releaseDate: t("pages.movies.movieDetails.releaseDate"),
            }}
          />

          <GenresList vod_class={(videoDetail?.vod_class ?? "").split(",")} />

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

          <Overview
            vod_content={videoDetail?.vod_content}
            overviewLabels={{
              overview: t("pages.movies.movieDetails.overview"),
              expand: t("pages.movies.movieDetails.expand"),
              collapse: t("pages.movies.movieDetails.collapse"),
            }}
          />

          <RelatedMovies
            movies={MOCK_MOVIE.movies as HomeRecommendListResponseMovie[]}
            onMovieClick={(movie) => console.log("Clicked:", movie)}
            title={t("pages.movies.movieDetails.relatedMovies")}
          />
        </div>
      </>
    );
  },
});
