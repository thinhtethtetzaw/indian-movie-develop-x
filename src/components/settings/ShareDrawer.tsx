import { DrawerHeaderBar } from "@/components/common/DrawerHeaderBar"; // 🔹 import here
import { DynamicDrawer } from "@/components/common/DynamicDrawer";
import { ShareSocialList } from "@/components/settings/ShareSocialList";
import { useDrawerStore } from "@/stores/useDrawerStore";
import { SquareArrowOutUpRight } from "lucide-react";

export function ShareDrawer() {
  const { hideDrawer } = useDrawerStore();

  return (
    <DynamicDrawer
      drawerKey="share"
      title="Share"
      description="Share our app"
      triggerIcon={<SquareArrowOutUpRight className="h-6 w-6 text-white" />}
      triggerLabel="Share our app"
    >
      <DrawerHeaderBar title="Share To Social Media" onClose={hideDrawer} />
      <ShareSocialList url="http://sample.info/?insect=fire&port=attract#cave" />
    </DynamicDrawer>
  );
}
