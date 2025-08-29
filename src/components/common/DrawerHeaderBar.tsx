import { X } from "lucide-react";
import { Button } from "../ui/button";

type DrawerHeaderBarProps = {
  title: string;
  onClose: () => void;
};

export function DrawerHeaderBar({ title, onClose }: DrawerHeaderBarProps) {
  return (
    <div className="mx-auto flex w-full items-center justify-between p-4">
      <h2 className="text-lg font-medium text-white">{title}</h2>
      <Button
        variant="ghost"
        size="icon"
        className="[&_svg:not([class*='size-'])]:size-6"
        onClick={onClose}
      >
        <X />
      </Button>
    </div>
  );
}
