import NotificationImage from "@/assets/svgs/image-notification-message.svg";
import { EmptyState } from "@/components/common/EmptyState";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/notifications")({
  component: () => (
    <EmptyState
      imageSrc={NotificationImage}
      title="You've caught up with everything"
      description="No notification at this time"
    />
  ),
});
