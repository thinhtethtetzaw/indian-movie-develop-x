import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bookmark/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/bookmark/"!</div>;
}
