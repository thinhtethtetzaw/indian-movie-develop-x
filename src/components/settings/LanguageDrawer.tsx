import Language from "@/assets/svgs/icon-language.svg?react";
import { DynamicDrawer } from "@/components/settings/DynamicDrawer";
import { LanguageList } from "@/components/settings/LanguageList";
import { useDrawerStore } from "@/stores/useDrawerStore";
import { useTranslation } from "react-i18next";

export function LanguageDrawer() {
  const { hideDrawer } = useDrawerStore();
  const { t, i18n } = useTranslation();

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    hideDrawer();
  };

  return (
    <DynamicDrawer
      drawerKey="language"
      title={t("pages.settings.language.title")}
      description="Change your language"
      triggerIcon={<Language className="size-6 text-white" />}
      triggerLabel={t("pages.settings.language.title")}
    >
      <LanguageList onSelect={handleSelect} />
    </DynamicDrawer>
  );
}
