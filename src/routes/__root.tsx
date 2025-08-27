import { TanstackDevtools } from "@tanstack/react-devtools";
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import Dialog from "@/components/common/Dialog";
import BottomNavbar from "@/components/common/layouts/BottomNavbar";
import type { QueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Toaster } from "sonner";

interface MyRouterContext {
  queryClient: QueryClient;
  layoutConfig: { isShowBottomNavbar: boolean };
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const routerState = useRouterState();
    const currentRoute = routerState.matches[routerState.matches.length - 1];
    const layoutConfig = currentRoute?.context.layoutConfig as
      | MyRouterContext["layoutConfig"]
      | undefined;
    const isShowBottomNavbar = layoutConfig?.isShowBottomNavbar ?? true;

    return (
      <>
        <NuqsAdapter>
          <div className="bg-background relative mx-auto flex h-dvh w-screen max-w-md flex-col overflow-hidden">
            <div className="pointer-events-none absolute z-[var(--z-popover)] size-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-2xl"></div>
            <div className="flex-1">
              <AnimatePresence mode="wait" initial={false}>
                <Outlet key={routerState.location.pathname} />
              </AnimatePresence>
            </div>
            {isShowBottomNavbar && <BottomNavbar />}
            <Toaster />
            <Dialog />
          </div>
          <TanstackDevtools
            config={{
              position: "top-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </NuqsAdapter>
      </>
    );
  },
});
