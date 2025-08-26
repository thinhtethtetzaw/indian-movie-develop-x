import NotificationEmptyImage from "@/assets/svgs/image-notification-empty.svg?react";
import { EmptyState } from "@/components/common/EmptyState";
import NavHeader from "@/components/common/layouts/NavHeader";
import PageTransition from "@/components/common/PageTransition";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/settings/notifications")({
  component: () => {
    const { t } = useTranslation();

    return (
      <PageTransition direction="right">
        <NavHeader
          backRoute={{
            to: "/settings",
          }}
          title={t("pages.settings.notifications.title")}
        />
        <section className="lighter-scrollbar h-[calc(100vh-var(--nav-header-height))]">
          <EmptyState
            imageSrc={<NotificationEmptyImage className="size-33" />}
            title={t("pages.settings.notifications.emptyTitle")}
            description={t("pages.settings.notifications.emptyDescription")}
          />
        </section>
      </PageTransition>
    );
  },
});
