import EpisodeAccordion from "@/components/page/movies/EpisodeAccordion";
import GenresList from "@/components/page/movies/GenresList";
import Overview from "@/components/page/movies/Overview";
import RelatedMovies from "@/components/page/movies/RelatedMovies";
import VideoInfo from "@/components/page/movies/VideoInfo";
import VideoPlayer from "@/components/page/movies/VideoPlayer";
import type { VideoResponse } from "@/types/api-schema/response";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/videos/$videoId")({
  component: RouteComponent,
});

const MOCK_MOVIE = {
  title: "Super Man",
  year: 2025,
  rating: 8.7,
  director: "Christopher Nolan",
  actors: [
    { name: "Keanu Reeves", character: "Superman" },
    { name: "Michael Nyqvist", character: "Lex Luthor" },
    { name: "Alfie Allen", character: "Jimmy Olsen" },
  ],
  releaseDate: "2023 April",
  genres: ["Action", "Fantasy", "Superhero", "Science"],
  overview:
    "When Superman gets drawn into conflicts at home and abroad, his actions are questioned, giving tech billionaire Lex Luthor the opportunity to get the Man of Steel out of the way for good...",
  poster:
    "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop",
  videoUrl:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-4">
      <VideoPlayer url={MOCK_MOVIE.videoUrl} poster={MOCK_MOVIE.poster} />

      <VideoInfo
        title={MOCK_MOVIE.title}
        year={MOCK_MOVIE.year}
        month={MOCK_MOVIE.releaseDate}
        rating={MOCK_MOVIE.rating}
        director={MOCK_MOVIE.director}
        actors={MOCK_MOVIE.actors.map((actor) => actor.name).join(", ")}
        releaseDate={MOCK_MOVIE.releaseDate}
        labels={{
          director: t("pages.movies.movieDetails.director"),
          actors: t("pages.movies.movieDetails.actors"),
          releaseDate: t("pages.movies.movieDetails.releaseDate"),
        }}
      />

      <GenresList genres={MOCK_MOVIE.genres} />

      {MOCK_MOVIE.seasons && MOCK_MOVIE.seasons.length > 0 && (
        <div className="space-y-4">
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
      )}

      <Overview
        overview={MOCK_MOVIE.overview}
        overviewLabels={{
          overview: t("pages.movies.movieDetails.overview"),
          expand: t("pages.movies.movieDetails.expand"),
          collapse: t("pages.movies.movieDetails.collapse"),
        }}
      />

      <RelatedMovies
        movies={MOCK_MOVIE.movies as unknown as VideoResponse[]}
        onMovieClick={(movie) => console.log("Clicked:", movie)}
        title={t("pages.movies.movieDetails.relatedMovies")}
      />
    </div>
  );
}

export default RouteComponent;
