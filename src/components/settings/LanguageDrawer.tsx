import { LanguageList } from "@/components/settings/LanguageList";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useDrawerStore } from "@/stores/useDrawerStore";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronRight, Languages } from "lucide-react";
import * as React from "react";

export function LanguageDrawer() {
  const { openDrawer, setOpen, hideDrawer } = useDrawerStore();
  const [selectedLanguage, setSelectedLanguage] = React.useState("en");

  const handleSelect = (code: string) => {
    setSelectedLanguage(code);
    hideDrawer();
  };

  return (
    <Drawer
      open={openDrawer === "language"}
      onOpenChange={(v: boolean) => setOpen("language", v)}
    >
      <DrawerTrigger asChild>
        <button className="flex w-full items-center justify-between p-4 shadow-md transition">
          <div className="flex items-center gap-3">
            <Languages className="h-6 w-6 text-white" />
            <span className="text-white">Language</span>
          </div>
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </DrawerTrigger>

      <DrawerContent className="fixed right-0 bottom-0 left-0 mx-auto max-w-md !rounded-t-[32px] border-[#2B2B2B] bg-[#2B2B2B] [&>div:first-child]:hidden">
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>Language</DrawerTitle>
          </DrawerHeader>
        </VisuallyHidden>

        <div className="mx-auto mt-3 h-[4px] w-[48px] rounded-[5px] bg-white" />

        <LanguageList
          selectedLanguage={selectedLanguage}
          onSelect={handleSelect}
        />

        <div className="mx-auto mb-3 h-[4px] w-[134px] rounded-[5px] bg-white" />
      </DrawerContent>
    </Drawer>
  );
}
