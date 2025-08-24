import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  backRoute?: { to: string; params?: Record<string, string> };
  rightNode?: ReactNode | ((...args: Array<unknown>) => ReactNode);
};

function NavHeader({ title, backRoute, rightNode }: Props) {
  const router = useRouter();
  // const canGoBack = useCanGoBack();

  return (
    <div className="bg-background sticky top-0 z-[var(--z-nav-layer)] flex h-[var(--nav-header-height)] items-center gap-x-4">
      <div className="absolute left-4">
        {!!backRoute && (
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              if (backRoute) {
                router.navigate({
                  to: backRoute.to,
                  params: backRoute.params,
                });
              } else {
                router.history.back();
              }
            }}
          >
            <ChevronLeftIcon className="text-forground size-6" />
          </Button>
        )}
      </div>
      <h2 className="text-forground flex-1 text-center text-lg font-medium">
        {title}
      </h2>
      <div className="absolute right-4">
        <>
          {!!rightNode &&
            (typeof rightNode === "function" ? rightNode() : rightNode)}
        </>
      </div>
    </div>
  );
}

export default NavHeader;
