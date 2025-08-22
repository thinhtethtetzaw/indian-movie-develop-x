import React from "react";

interface GenresListProps {
  vod_class: string | string[];
}

const GenresList: React.FC<GenresListProps> = ({ vod_class }) => {
  const genresArray = Array.isArray(vod_class)
    ? vod_class
    : vod_class.split(",");
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {genresArray.map((genre, index) => (
        <div
          key={index}
          className="inline-flex items-center justify-center gap-6 rounded-full bg-gradient-to-r from-white/12 to-white/4 px-4 py-2 text-xs font-medium text-white"
        >
          {genre}
        </div>
      ))}
    </div>
  );
};

export default GenresList;
