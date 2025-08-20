import NotificationImage from "@/assets/svgs/image-notification-message.svg";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/notifications")({
  component: () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-8 text-white">
      <div className="mx-auto flex max-w-sm flex-col items-center space-y-2 text-center">
        <img
          src={NotificationImage}
          alt="notification empty state illustration"
          className="h-33 w-33"
        />
        <h2 className="text-xl font-semibold text-white">
          You've caught up with everything
        </h2>
        <p className="text-sm text-gray-400">No notification at this time</p>
      </div>
    </div>
  ),
});
