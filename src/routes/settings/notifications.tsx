import NotificationImage from "@/assets/svgs/image-notification-message.svg";
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
          imageSrc={NotificationImage}
          title="You've caught up with everything"
          description="No notification at this time"
        />
      </>
    );
  },
});
