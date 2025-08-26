import { useGetAllTypes } from "@/apis/app/queryGetAllTypes";
import { useGetHomeRecommendList } from "@/apis/app/queryGetHomeRecommendList";
import { useGetVideoListByIds } from "@/apis/app/queryGetVideoListByIds";
import SearchHeader from "@/components/common/layouts/SearchHeader";
import { Tag, TagSkeleton } from "@/components/common/Tag";
import VideoCard, { VideoCardSkeleton } from "@/components/common/VideoCard";
import {
  WatchListSectionSkeleton,
  WishListSection,
} from "@/components/common/WishlistSection";
import SliderCarousel from "@/components/page/home/SliderCarousel";
import { Filter } from "@/components/page/search";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import type {
  CarouselVideoResponse,
  VideoResponse,
} from "@/types/api-schema/response";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { parseAsString, useQueryStates } from "nuqs";
import React, { useCallback, useMemo } from "react";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
  beforeLoad: () => ({
    layoutConfig: {
      isShowBottomNavbar: true,
    },
  }),
});

// Constants
const SKELETON_COUNTS = {
  TAG: 4,
  CAROUSEL_DOTS: 3,
  LIST_ITEMS: 5,
  TOPIC_ITEMS: 6,
} as const;

// Types
interface NavigatorItem {
  navigator?: {
    id: string;
    title: string;
  };
}

// Skeleton Components
const CarouselSkeleton = () => (
  <div className="px-4">
    <Skeleton className="h-[157px] w-full rounded-xl" />
    <div className="mt-6 flex justify-center gap-1">
      {Array.from({ length: SKELETON_COUNTS.CAROUSEL_DOTS }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-1 w-4 rounded-full", {
            "bg-red-500": index === 0,
            "bg-gray-400/70": index !== 0,
          })}
        />
      ))}
    </div>
  </div>
);

const ListSectionSkeleton = ({
  renderVideoCardSkeleton,
}: {
  renderVideoCardSkeleton: (index: number) => React.ReactNode;
}) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between px-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-6 w-20" />
    </div>
    <div className="scrollbar-hide flex gap-3 overflow-x-auto pl-4">
      {Array.from({ length: SKELETON_COUNTS.LIST_ITEMS }).map((_, index) => (
        <div key={index} className="flex-shrink-0 last:pr-4">
          {renderVideoCardSkeleton(index)}
        </div>
      ))}
    </div>
  </section>
);

const TopicSectionSkeleton = ({
  renderVideoCardSkeleton,
}: {
  renderVideoCardSkeleton: (index: number) => React.ReactNode;
}) => (
  <section className="space-y-4 px-4">
    <Skeleton className="h-6 w-32" />
    <div className="grid grid-cols-3 gap-x-3 gap-y-6">
      {Array.from({ length: SKELETON_COUNTS.TOPIC_ITEMS }).map((_, index) => (
        <div key={index} className="flex-shrink-0">
          {renderVideoCardSkeleton(index)}
        </div>
      ))}
    </div>
    <Skeleton className="h-14 w-full" />
  </section>
);

const HomeSkeleton = ({
  renderVideoCardSkeleton,
}: {
  renderVideoCardSkeleton: (index: number) => React.ReactNode;
}) => (
  <div className="mt-5 space-y-10">
    <CarouselSkeleton />
    <WatchListSectionSkeleton />
    <ListSectionSkeleton renderVideoCardSkeleton={renderVideoCardSkeleton} />
    <TopicSectionSkeleton renderVideoCardSkeleton={renderVideoCardSkeleton} />
  </div>
);

// Content Components
const CategoryTags = ({
  allTypes,
  isLoading,
  searchState,
  setSearchState,
  renderTagSkeletons,
}: {
  allTypes: any[] | undefined;
  isLoading: boolean;
  searchState: { type: string };
  setSearchState: (state: { type: string }) => void;
  renderTagSkeletons: () => React.ReactNode;
}) => (
  <div className="scrollbar-hide flex items-center gap-x-1.5 overflow-auto">
    {isLoading
      ? renderTagSkeletons()
      : allTypes?.map((category, index) => (
          <Tag
            key={category.type_id}
            index={index}
            size="lg"
            className={cn("cursor-pointer", {
              "ml-4": index === 0,
              "mr-4": index === allTypes.length - 1,
            })}
            variant={
              searchState.type === category.type_id?.toString()
                ? "active"
                : "default"
            }
            onClick={() =>
              setSearchState({
                type: category.type_id?.toString() ?? "0",
              })
            }
          >
            {category.type_name}
          </Tag>
        ))}
  </div>
);

const CarouselSection = ({
  videos,
  onVideoClick,
}: {
  videos: CarouselVideoResponse[];
  onVideoClick: (video: VideoResponse) => void;
}) => (
  <section>
    <SliderCarousel videos={videos} onVideoClick={onVideoClick} />
  </section>
);

const ListSection = ({
  item,
  onVideoClick,
  navigate,
}: {
  item: any & NavigatorItem;
  onVideoClick: (video: VideoResponse) => void;
  navigate: any;
}) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between px-4">
      <h2 className="text-forground font-semibold">{item.title}</h2>
      <Button
        variant="link"
        className="text-forground text-sm font-medium"
        onClick={() => {
          if ("navigator" in item && item.navigator) {
            navigate({
              to: "/home/navigator/$navigatorId",
              params: {
                navigatorId: item.navigator.id ?? "",
              },
            });
          }
        }}
      >
        {"navigator" in item && item.navigator?.title} <ChevronRightIcon />
      </Button>
    </div>
    <div className="scrollbar-hide flex gap-3 overflow-x-auto pl-4">
      {item.list.map((video: VideoResponse, index: number) => (
        <div key={video.vod_id} className="flex-shrink-0 last:pr-4">
          <VideoCard video={video} onClick={onVideoClick} index={index} />
        </div>
      ))}
    </div>
  </section>
);

const TopicSection = ({
  item,
  onVideoClick,
}: {
  item: any & NavigatorItem;
  onVideoClick: (video: VideoResponse) => void;
}) => (
  <section className="space-y-4 px-4">
    <h2 className="text-forground font-semibold">{item.title}</h2>
    <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
      {item.list.map((video: VideoResponse, index: number) => (
        <div key={video.vod_id} className="flex-shrink-0">
          <VideoCard video={video} onClick={onVideoClick} index={index} />
        </div>
      ))}
    </div>
    <Button
      variant="default"
      className="text-forground w-full bg-white/10 py-6 hover:bg-white/20"
    >
      {"navigator" in item && item.navigator?.title}
      <ChevronDownIcon />
    </Button>
  </section>
);

const FilterSection = ({ searchState }: { searchState: { type: string } }) => (
  <AnimatePresence mode="wait">
    {searchState.type !== "0" && (
      <motion.div
        className="px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.2,
          ease: [0.4, 0.0, 0.2, 1],
          opacity: { duration: 0.15 },
        }}
      >
        <Filter />
      </motion.div>
    )}
  </AnimatePresence>
);

function RouteComponent() {
  const navigate = useNavigate();
  const [searchState, setSearchState] = useQueryStates({
    type: parseAsString.withDefault("0"),
  });

  // Data fetching
  const watchListFromIndexDB = useLiveQuery(() =>
    db.watchList
      .orderBy("created_at")
      .reverse()
      .toArray()
      .catch((err) => {
        console.error("Dexie query error:", err);
        return [];
      }),
  );

  const isIndexDBLoading = watchListFromIndexDB === undefined;
  const watchListData = watchListFromIndexDB ?? [];

  const { videoList, isLoading: isVideoListLoading } = useGetVideoListByIds({
    videoIds: watchListData.map((watchList) => watchList.id ?? ""),
    queryConfig: {
      enabled: watchListData.length > 0,
    },
  });

  const { homeRecommendList, isLoading: isRecommendListLoading } =
    useGetHomeRecommendList({});

  const { allTypes, isLoading: isCategoryListLoading } = useGetAllTypes({});

  // Computed values
  const watchListVideos = useMemo(
    () =>
      videoList?.filter((video) =>
        watchListData.some((bookmark) => bookmark.id === video.vod_id),
      ),
    [watchListData, videoList],
  );

  // Event handlers
  const handleVideoClick = useCallback(
    (video: VideoResponse) => {
      navigate({
        to: "/videos/$videoId",
        params: {
          videoId: video.vod_id ?? "",
        },
      });
    },
    [navigate],
  );

  const handleSearchClick = useCallback(() => {
    navigate({ to: "/search" });
  }, [navigate]);

  // Render helpers
  const renderVideoCardSkeleton = useCallback(
    (index: number) => <VideoCardSkeleton index={index} />,
    [],
  );

  const renderTagSkeletons = useCallback(
    () =>
      Array.from({ length: SKELETON_COUNTS.TAG }).map((_, index) => (
        <TagSkeleton
          key={`tag-skeleton-${index}`}
          index={index}
          className={cn("", {
            "ml-4": index === 0,
            "mr-4": index === SKELETON_COUNTS.TAG - 1,
          })}
        />
      )),
    [],
  );

  const renderRecommendationItem = useCallback(
    (item: any, index: number) => {
      const hasList = item.list && item.list.length > 0;

      return (
        <React.Fragment key={item.title}>
          {item.type === "carousel" && hasList && (
            <CarouselSection
              videos={item.list as CarouselVideoResponse[]}
              onVideoClick={handleVideoClick}
            />
          )}

          {index === 0 && (
            <>
              {isVideoListLoading || isIndexDBLoading ? (
                <WatchListSectionSkeleton />
              ) : (
                watchListData.length > 0 && (
                  <WishListSection
                    watchListFromIndexDB={watchListFromIndexDB}
                    watchListVideos={watchListVideos ?? []}
                  />
                )
              )}
            </>
          )}

          {item.type === "list" && hasList && (
            <ListSection
              item={item}
              onVideoClick={handleVideoClick}
              navigate={navigate}
            />
          )}

          {item.type === "topic" && hasList && (
            <TopicSection item={item} onVideoClick={handleVideoClick} />
          )}
        </React.Fragment>
      );
    },
    [
      handleVideoClick,
      isVideoListLoading,
      isIndexDBLoading,
      watchListData.length,
      watchListVideos,
      navigate,
    ],
  );

  return (
    <>
      <SearchHeader
        isShowBack={false}
        isClickable={true}
        onClick={handleSearchClick}
      />
      <div className="lighter-scrollbar h-[calc(100vh-var(--search-header-height)-var(--bottom-nav-height))] space-y-6 overflow-y-auto pb-5">
        <CategoryTags
          allTypes={allTypes}
          isLoading={isCategoryListLoading}
          searchState={searchState}
          setSearchState={setSearchState}
          renderTagSkeletons={renderTagSkeletons}
        />

        {searchState.type === "0" ? (
          <div className="space-y-10">
            {isRecommendListLoading ? (
              <HomeSkeleton renderVideoCardSkeleton={renderVideoCardSkeleton} />
            ) : (
              homeRecommendList?.map(renderRecommendationItem)
            )}
          </div>
        ) : (
          <FilterSection searchState={searchState} />
        )}
      </div>
    </>
  );
}
