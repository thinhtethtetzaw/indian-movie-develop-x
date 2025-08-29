import { useGetAds } from "@/apis/app/queryGetAds";
import { useGetAppConfig } from "@/apis/app/queryGetAppConfig";
import { useGetVideoListByIds } from "@/apis/app/queryGetVideoListByIds";
import Info from "@/assets/svgs/icon-info.svg?react";
import Notification from "@/assets/svgs/icon-notification.svg?react";
import { AdsSection } from "@/components/common/AdsSection";
import NavHeader from "@/components/common/layouts/NavHeader";
import Loading from "@/components/common/Loading";
import { WatchListSection } from "@/components/common/WatchlistSection";
import { LanguageDrawer } from "@/components/settings/LanguageDrawer";
import { ShareDrawer } from "@/components/settings/ShareDrawer";
import { db } from "@/lib/db";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronRightIcon } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  // Watchlist
  const watchListFromIndexDB = useLiveQuery(() =>
    db.watchList
      .orderBy("updated_at")
      .reverse()
      .toArray()
      .catch((err) => {
        console.error("Dexie query error:", err);
        return [];
      }),
  );
  const isIndexDBLoading = watchListFromIndexDB === undefined;
  const watchListData = watchListFromIndexDB ?? [];
  const { videoList, isLoading: isVideoListLoading } = useGetVideoListByIds({
    videoIds: watchListData.map((watchList) => watchList.id ?? ""),
    queryConfig: {
      enabled: watchListData.length > 0,
    },
  });
  // Computed values
  const watchListVideos = useMemo(
    () =>
      videoList?.filter((video) =>
        watchListData.some((watchlist) => watchlist.id === video.vod_id),
      ),
    [watchListData, videoList],
  );

  // Configlist
  const { appConfig, isLoading: isConfigListLoading } = useGetAppConfig({});

  // Ads list
  const { allAds, isLoading: isAdsLoading } = useGetAds({
    uniqueLabel: "setting_page_ads",
  });

  return (
    <>
      <NavHeader title={t("pages.settings.title")} />

      <section className="lighter-scrollbar h-[calc(100dvh-var(--nav-header-height)-var(--bottom-nav-height))] overflow-y-auto py-5 text-white">
        {!isConfigListLoading &&
        !isAdsLoading &&
        !isVideoListLoading &&
        !isIndexDBLoading ? (
          <div className="space-y-6">
            {allAds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="px-4"
              >
                <AdsSection allAds={allAds} />
              </motion.div>
            )}

            {watchListData.length > 0 && (
              <WatchListSection
                watchListFromIndexDB={watchListFromIndexDB}
                watchListVideos={watchListVideos ?? []}
              />
            )}

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4 px-4">
                <motion.div
                  className="rounded-2xl bg-white/12"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Link
                    to="/settings/notifications"
                    className="flex w-full items-center justify-between p-4 shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="relative"
                        whileHover={{ rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Notification className="size-6 text-white" />
                      </motion.div>
                      <p className="text-sm">
                        {t("pages.settings.notifications.title")}
                      </p>
                    </div>
                    <ChevronRightIcon className="size-6 text-white" />
                  </Link>

                  <div className="px-4">
                    <hr className="w-full border-white/4" />
                  </div>
                  <LanguageDrawer />
                </motion.div>

                <motion.div
                  className="rounded-2xl bg-white/12"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {appConfig?.share_link && (
                    <ShareDrawer shareConfigLink={appConfig.share_link} />
                  )}

                  <div className="px-4">
                    <hr className="w-full border-white/4" />
                  </div>

                  <div className="flex w-full items-center justify-between p-4 shadow-md">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Info className="size-6 text-white" />
                      </motion.div>
                      <p className="text-sm">
                        {t("pages.settings.version.title")}
                      </p>
                    </div>
                    <p className="text-sm text-white">V1.0.1</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
}
