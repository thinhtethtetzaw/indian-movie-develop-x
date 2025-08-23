import { motion } from "motion/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface OverviewProps {
  vod_content?: string;
}

const Overview: React.FC<OverviewProps> = ({ vod_content }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

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
              height: expanded ? "auto" : "4.5rem",
              overflow: "hidden",
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <p className="text-sm leading-relaxed text-gray-400">
              {vod_content}
            </p>
          </motion.div>

          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-sm font-medium text-gray-200"
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            {expanded
              ? t("pages.movies.movieDetails.collapse")
              : t("pages.movies.movieDetails.expand")}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Overview;
