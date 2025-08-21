import type { Movie } from "@/components/common/MovieCard";

export const MOCK_MOVIES: Movie[] = [
  {
    id: "1",
    title: "Superman",
    imageUrl: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
    rating: 4.0,
    episode: null,
    isFavorite: false,
  },
  {
    id: "2",
    title: "The Dark Knight",
    imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: null,
    episode: 10,
    isFavorite: true,
  },
  {
    id: "3",
    title: "Inception",
    imageUrl: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    rating: 4.5,
    episode: null,
    isFavorite: false,
  },
  {
    id: "4",
    title: "Interstellar 1",
    imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    rating: 4.7,
    episode: null,
    isFavorite: false,
  },
  {
    id: "5",
    title: "Interstellar 2",
    imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    rating: 4.7,
    episode: null,
    isFavorite: false,
  },
];
