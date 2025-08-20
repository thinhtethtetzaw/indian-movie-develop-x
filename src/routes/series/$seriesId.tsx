import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/series/$seriesId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/series/$seriesId"!</div>
}
