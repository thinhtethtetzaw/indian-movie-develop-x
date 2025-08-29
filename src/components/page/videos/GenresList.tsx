import { Tag } from "@/components/common/Tag";
import React from "react";

interface GenresListProps {
  vod_class: string | string[];
}

const GenresList: React.FC<GenresListProps> = ({ vod_class }) => {
  const genresArray = Array.isArray(vod_class)
    ? vod_class
    : vod_class.split(",");
  return (
    <div className="flex flex-wrap gap-2">
      {genresArray.map((genre, index) => (
        <Tag key={index}>{genre}</Tag>
      ))}
    </div>
  );
};

export default GenresList;
