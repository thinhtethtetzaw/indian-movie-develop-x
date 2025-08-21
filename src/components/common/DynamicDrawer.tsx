import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { DrawerKey } from "@/stores/useDrawerStore";
import { useDrawerStore } from "@/stores/useDrawerStore";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronRight } from "lucide-react";
import React from "react";

type DynamicDrawerProps = {
  drawerKey: Exclude<DrawerKey, null>;
  title: string;
  description?: string;
  triggerIcon: React.ReactNode;
  triggerLabel: string;
  children: React.ReactNode;
};

export function DynamicDrawer({
  drawerKey,
  title,
  description,
  triggerIcon,
  triggerLabel,
  children,
}: DynamicDrawerProps) {
  const { openDrawer, setOpen } = useDrawerStore();

  return (
    <Drawer
      open={openDrawer === drawerKey}
      onOpenChange={(v) => setOpen(drawerKey, v)}
    >
      <DrawerTrigger asChild>
        <div className="flex w-full items-center justify-between p-4 shadow-md transition">
          <div className="flex items-center gap-3">
            {triggerIcon}
            <span className="text-white">{triggerLabel}</span>
          </div>
          <ChevronRight className="h-6 w-6 text-white" />
        </div>
      </DrawerTrigger>

      <DrawerContent className="fixed right-0 bottom-0 left-0 mx-auto max-w-md !rounded-t-[32px] border-[#2B2B2B] bg-[#2B2B2B] [&>div:first-child]:hidden">
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
        </VisuallyHidden>

        <div className="mx-auto mt-3 h-[4px] w-[48px] rounded-[5px] bg-white" />

        {children}

        <div className="mx-auto mb-3 h-[4px] w-[134px] rounded-[5px] bg-white" />
      </DrawerContent>
    </Drawer>
  );
}
