import NotificationEmptyImage from "@/assets/svgs/image-notification-empty.svg?react";
import { EmptyState } from "@/components/common/EmptyState";
import NavHeader from "@/components/common/layouts/NavHeader";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/settings/notifications")({
  component: () => {
    const { t } = useTranslation();

    return (
      <>
        <NavHeader
          isShowBack={true}
          title={t("pages.settings.notifications.title")}
        />
        <EmptyState
          imageSrc={<NotificationEmptyImage className="size-33" />}
          title={t("pages.settings.notifications.emptyTitle")}
          description={t("pages.settings.notifications.emptyDescription")}
        />
      </>
    );
  },
});
