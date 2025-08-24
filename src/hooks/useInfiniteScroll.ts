import { useCallback, useRef } from "react";

interface Props {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  checkPosition: "top" | "bottom";
}

export default function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  checkPosition = "bottom",
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollRooms = useCallback(() => {
    if (!viewportRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;

    if (!hasNextPage) return;

    const isAtBottom = scrollTop + clientHeight + 5 >= scrollHeight;
    const isAtTop = scrollTop + scrollHeight - 5 <= clientHeight;

    if (
      ((isAtTop && checkPosition === "top") ||
        (isAtBottom && checkPosition === "bottom")) &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { scrollRooms, viewportRef };
}
