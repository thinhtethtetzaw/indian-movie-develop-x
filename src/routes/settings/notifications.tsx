import { useGetAds } from "@/apis/app/queryGetAds";
import NotificationEmptyImage from "@/assets/svgs/image-notification-empty.svg?react";
import { AdsSection, AdsSectionSkeleton } from "@/components/common/AdsSection";
import { EmptyState } from "@/components/common/EmptyState";
import NavHeader from "@/components/common/layouts/NavHeader";
import PageTransition from "@/components/common/PageTransition";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/settings/notifications")({
  component: () => {
    const { t } = useTranslation();

    // Ads list
    const { allAds, isLoading: isAdsLoading } = useGetAds({
      uniqueLabel: "noti_page_ads",
    });

    return (
      <PageTransition direction="right">
        <NavHeader
          backRoute={{
            to: "/settings",
          }}
          title={t("pages.settings.notifications.title")}
        />
        <section className="lighter-scrollbar h-[calc(100vh-var(--nav-header-height))] pt-5">
          {isAdsLoading ? (
            <>
              <AdsSectionSkeleton />
            </>
          ) : (
            allAds.length > 0 && (
              <div className="px-4">
                <AdsSection allAds={allAds} isShowTitle={false} />
              </div>
            )
          )}
          <div>
            <EmptyState
              imageSrc={<NotificationEmptyImage className="size-33" />}
              title={t("pages.settings.notifications.emptyTitle")}
              description={t("pages.settings.notifications.emptyDescription")}
            />
          </div>
        </section>
      </PageTransition>
    );
  },
});
