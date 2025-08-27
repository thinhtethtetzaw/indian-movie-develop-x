// db.ts
import Dexie, { type EntityTable } from "dexie";

interface Bookmark {
  id: string;
  created_at: Date;
}

interface WatchList {
  id: string;
  ep_id: string;
  play_head_in_sec: number;
  created_at: Date;
}

interface RecentSearch {
  search: string;
  created_at: Date;
}

const db = new Dexie("IndiaMovie") as Dexie & {
  bookmarks: EntityTable<Bookmark, "id">;
  watchList: EntityTable<WatchList, "id">;
  recentSearch: EntityTable<RecentSearch, "search">;
};

// Schema declaration:
db.version(1).stores({
  bookmarks: "id, created_at",
  watchList: "[id+ep_id], ep_id, play_head_in_sec, created_at",
  recentSearch: "search, created_at",
});

export { db };
export type { Bookmark, WatchList };
