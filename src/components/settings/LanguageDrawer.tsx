import { DynamicDrawer } from "@/components/common/DynamicDrawer";
import { LanguageList } from "@/components/settings/LanguageList";
import { useDrawerStore } from "@/stores/useDrawerStore";
import { Languages } from "lucide-react";
import React from "react";

export function LanguageDrawer() {
  const [selectedLanguage, setSelectedLanguage] = React.useState("en");
  const { hideDrawer } = useDrawerStore();

  const handleSelect = (code: string) => {
    setSelectedLanguage(code);
    hideDrawer();
  };

  return (
    <DynamicDrawer
      drawerKey="language"
      title="Language"
      description="Change your language"
      triggerIcon={<Languages className="h-6 w-6 text-white" />}
      triggerLabel="Language"
    >
      <LanguageList
        selectedLanguage={selectedLanguage}
        onSelect={handleSelect}
      />
    </DynamicDrawer>
  );
}
