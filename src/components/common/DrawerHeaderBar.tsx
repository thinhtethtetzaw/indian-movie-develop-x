import { X } from "lucide-react";

type DrawerHeaderBarProps = {
  title: string;
  onClose: () => void;
};

export function DrawerHeaderBar({ title, onClose }: DrawerHeaderBarProps) {
  return (
    <div className="mx-auto flex w-full items-center justify-between p-4">
      <h2 className="text-lg font-medium text-white">{title}</h2>
      <button
        onClick={onClose}
        className="text-gray-400 transition-colors hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
