import { TanstackDevtools } from "@tanstack/react-devtools";
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import Footer from "@/components/common/layouts/Footer";
import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
  layoutConfig: { isShowNavbar: boolean };
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const routerState = useRouterState();
    const currentRoute = routerState.matches[routerState.matches.length - 1];
    const layoutConfig = currentRoute.context.layoutConfig ?? {};
    const isShowNavbar = layoutConfig.isShowNavbar ?? true;

    return (
      <>
        <div className="bg-background mx-auto flex h-dvh w-screen max-w-md flex-col justify-between">
          <div className="flex-1">
            <Outlet />
          </div>
          {isShowNavbar && <Footer />}
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
      </>
    );
  },
});
