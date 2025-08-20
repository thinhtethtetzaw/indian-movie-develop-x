import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useDrawerStore } from "@/stores/useDrawerStore";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronRight, SquareArrowOutUpRight } from "lucide-react";
import { ShareSocialList } from "./ShareSocialList";

export function ShareDrawer() {
  const { openDrawer, setOpen } = useDrawerStore();

  return (
    <Drawer
      open={openDrawer === "share"}
      onOpenChange={(v: boolean) => setOpen("share", v)}
    >
      <DrawerTrigger asChild>
        <div className="flex w-full items-center justify-between p-4 shadow-md transition">
          <div className="flex items-center gap-3">
            <SquareArrowOutUpRight className="h-6 w-6 text-white" />
            <span className="text-white">Share our app</span>
          </div>
          <ChevronRight className="h-6 w-6 text-white" />
        </div>
      </DrawerTrigger>

      <DrawerContent className="fixed right-0 bottom-0 left-0 mx-auto max-w-md !rounded-t-[32px] border-[#2B2B2B] bg-[#2B2B2B] [&>div:first-child]:hidden">
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>Share</DrawerTitle>
            <DrawerDescription>Share our app</DrawerDescription>
          </DrawerHeader>
        </VisuallyHidden>

        <div className="mx-auto mt-3 h-[4px] w-[48px] rounded-[5px] bg-white" />

        <ShareSocialList
          url="http://sample.info/?insect=fire&port=attract#cave"
          setOpen={setOpen}
        />

        <div className="mx-auto mb-3 h-[4px] w-[134px] rounded-[5px] bg-white" />
      </DrawerContent>
    </Drawer>
  );
}
