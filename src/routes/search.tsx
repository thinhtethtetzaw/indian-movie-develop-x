import TrashIcon from "@/assets/svgs/icon-trash.svg?react";
import SearchHeader from "@/components/common/layouts/SearchHeader";
import MovieCard from "@/components/common/MovieCard";
import { Button } from "@/components/ui/button";
import { MOCK_MOVIES } from "@/constants/mock";
import { createFileRoute } from "@tanstack/react-router";
import { t } from "i18next";
import { ChevronDownIcon } from "lucide-react";
import { motion } from "motion/react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

export const Route = createFileRoute("/search")({
  component: RouteComponent,
  beforeLoad: () => {
    return {
      layoutConfig: {
        isShowBottomNavbar: false,
      },
    };
  },
});

function RouteComponent() {
  const [recentlySearched, setRecentlySearched] = useState([
    "Havana",
    "Archon",
    "Novaria",
    "Angela",
    "The Dark Knight",
    "Inception",
    "Interstellar",
    "The Matrix",
  ]);
  const [searchTerm] = useQueryState("q", parseAsString.withDefault(""));

  const handleRecentItemClick = (item: string) => {
    console.log("Searching for:", item);
  };

  const handleClearRecent = () => {
    setRecentlySearched([]);
  };

  if (recentlySearched.length === 0) {
    return (
      <div>
        <SearchHeader isShowBack autoFocus={true} />
      </div>
    );
  }

  return (
    <div>
      <SearchHeader isShowBack={true} autoFocus={true} />

      {/* Recent Search */}
      <motion.div
        className="pt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {!searchTerm && recentlySearched.length > 0 && (
          <div>
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center justify-between px-4">
                <p className="text-base font-semibold text-white">
                  {t("pages.search.recent")}
                </p>

                <TrashIcon className="h-5 w-5" onClick={handleClearRecent} />
              </div>

              <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 pl-4 last:pr-4">
                {recentlySearched.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: Number(index) * 0.07,
                    }}
                    key={item}
                    className="flex-shrink-0 rounded-md bg-white/10 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-gray-300 transition-colors hover:bg-white/20"
                    onClick={() => handleRecentItemClick(item)}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
            <section className="mt-5 space-y-4 px-4">
              <h2 className="text-forground font-semibold">
                {t("pages.search.popularSearches")}
              </h2>
              <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
                {MOCK_MOVIES.map((movie) => (
                  <div key={movie.id} className="flex-shrink-0">
                    <MovieCard
                      movie={movie}
                      onFavoriteToggle={() => console.log("favorite")}
                      onClick={() => {}}
                    />
                  </div>
                ))}
              </div>
              <Button
                variant="default"
                className="text-forground w-full bg-white/10 py-6 hover:bg-white/20"
              >
                {t("common.viewMore")}
                <ChevronDownIcon />
              </Button>
            </section>
          </div>
        )}
      </motion.div>
    </div>
  );
}
