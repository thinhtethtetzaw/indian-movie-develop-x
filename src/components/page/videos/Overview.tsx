import { motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface OverviewProps {
  vod_content?: string;
}

const Overview: React.FC<OverviewProps> = ({ vod_content }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const wordLimit = 30;

  const hasMoreThanLimit = useMemo(() => {
    if (!vod_content) return false;
    const words = vod_content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return words.length > wordLimit;
  }, [vod_content]);

  const truncatedText = useMemo(() => {
    if (!vod_content || !hasMoreThanLimit) return vod_content;
    const words = vod_content.trim().split(/\s+/);
    return words.slice(0, wordLimit).join(" ") + "...";
  }, [vod_content, hasMoreThanLimit, wordLimit]);

  return (
    <div>
      <h3 className="text-md mb-2 font-semibold">
        {t("pages.movies.movieDetails.overview")}
      </h3>
      {!vod_content && (
        <p className="text-sm text-gray-400">{t("common.noData")}</p>
      )}
      {vod_content && (
        <div className="relative">
          <motion.div
            initial={false}
            animate={{
              height: expanded ? "auto" : "auto",
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="overflow-hidden"
          >
            <motion.p
              className="text-sm leading-relaxed text-gray-400"
              initial={false}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              {expanded ? vod_content : truncatedText}
              {hasMoreThanLimit && (
                <motion.button
                  onClick={() => setExpanded(!expanded)}
                  className="inline-flex text-sm font-medium text-gray-200"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ opacity: 0.8 }}
                  transition={{ duration: 0.1 }}
                >
                  {expanded
                    ? t("pages.movies.movieDetails.collapse")
                    : t("pages.movies.movieDetails.expand")}
                </motion.button>
              )}
            </motion.p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Overview;
