import { LanguageDrawer } from "@/components/settings/LanguageDrawer";
import { ShareDrawer } from "@/components/settings/ShareDrawer";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronRight, Circle, Info } from "lucide-react";

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto min-h-screen bg-[#0a0a0a] p-4 text-white">
      <div className="space-y-4">
        <div className="rounded-2xl bg-white/12">
          <button
            onClick={() => navigate({ to: "/settings/notifications" })}
            className="flex w-full items-center justify-between p-4 shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-6 w-6 text-white" />
                <Circle
                  className="absolute top-0 right-0 h-2 w-2 text-red-500"
                  fill="red"
                />
              </div>
              <span>Notifications</span>
            </div>
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          <div className="px-4">
            <hr className="w-full border-white/4" />
          </div>
          <LanguageDrawer />
        </div>

        <div className="rounded-2xl bg-white/12">
          <ShareDrawer />

          <div className="px-4">
            <hr className="w-full border-white/4" />
          </div>

          <div className="flex w-full items-center justify-between p-4 shadow-md">
            <div className="flex items-center gap-3">
              <Info className="h-6 w-6 text-white" />
              <span>Version</span>
            </div>
            <span className="text-white">V1.0.0.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
