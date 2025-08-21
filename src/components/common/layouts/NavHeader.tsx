import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  isShowBack: boolean;
  rightNode: ReactNode | ((...args: Array<unknown>) => ReactNode);
};

function NavHeader({ title, isShowBack, rightNode }: Props) {
  return (
    <div className="relative flex h-[var(--nav-header-height)] items-center gap-x-4">
      <div className="absolute left-4">
        {isShowBack && (
          <Button variant={"ghost"} size={"icon"}>
            <ChevronLeftIcon className="text-forground size-6" />
          </Button>
        )}
      </div>
      <h2 className="text-forground flex-1 text-center text-lg font-medium">
        {title}
      </h2>
      <div className="absolute right-4">
        {typeof rightNode === "function" ? rightNode() : rightNode}
      </div>
    </div>
  );
}

export default NavHeader;
