// db.ts
import Dexie, { type EntityTable } from "dexie";

interface Bookmark {
  id: string;
  updated_at: Date;
}

interface WatchList {
  id: string;
  ep_id: string;
  play_head_in_sec: number;
  duration: number;
  updated_at: Date;
}

interface RecentSearch {
  search: string;
  updated_at: Date;
}

const db = new Dexie("IndiaMovie") as Dexie & {
  bookmarks: EntityTable<Bookmark, "id">;
  watchList: EntityTable<WatchList, "id">;
  recentSearch: EntityTable<RecentSearch, "search">;
};

// Schema declaration:
db.version(1).stores({
  bookmarks: "id, updated_at",
  watchList: "[id+ep_id], ep_id, play_head_in_sec, duration, updated_at",
  recentSearch: "search, updated_at",
});

export { db };
export type { Bookmark, WatchList };
