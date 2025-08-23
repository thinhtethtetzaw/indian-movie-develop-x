import ShareApp from "@/assets/svgs/icon-share-app.svg?react";
import { DrawerHeaderBar } from "@/components/common/DrawerHeaderBar";
import { DynamicDrawer } from "@/components/settings/DynamicDrawer";
import { ShareSocialList } from "@/components/settings/ShareSocialList";
import { useDrawerStore } from "@/stores/useDrawerStore";
import { useTranslation } from "react-i18next";

export function ShareDrawer({ shareConfigLink }: { shareConfigLink?: any }) {
  const { hideDrawer } = useDrawerStore();
  const { t } = useTranslation();

  return (
    <DynamicDrawer
      drawerKey="share"
      title={t("pages.settings.shareApp.title")}
      description="Share our app"
      triggerIcon={<ShareApp className="size-6 text-white" />}
      triggerLabel={t("pages.settings.shareApp.title")}
    >
      <DrawerHeaderBar title="Share To Social Media" onClose={hideDrawer} />
      <ShareSocialList url={shareConfigLink} />
    </DynamicDrawer>
  );
}
