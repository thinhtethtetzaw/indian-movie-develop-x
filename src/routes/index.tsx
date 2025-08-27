import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: async () => {
    return redirect({
      to: "/home",
    });
  },
});

function RouteComponent() {
  return <div>Hello from India Movie</div>;
}
