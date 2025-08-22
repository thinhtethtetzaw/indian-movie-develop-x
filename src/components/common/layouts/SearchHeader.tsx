import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { useDebounce } from "@uidotdev/usehooks";
import { t } from "i18next";
import { ChevronLeftIcon, Loader2, SearchIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";
import { parseAsString, useQueryState } from "nuqs";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

type Props = {
  isShowBack: boolean;
  isClickable?: boolean;
  onClick?: () => void;
  autoFocus?: boolean;
};

export interface SearchHeaderRef {
  focus: () => void;
}

const SearchHeader = forwardRef<SearchHeaderRef, Props>(
  ({ isShowBack, isClickable = false, onClick, autoFocus = false }, ref) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useQueryState(
      "q",
      parseAsString.withDefault(""),
    );
    const [isResultLoading, setIsResultLoading] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Expose focus method to parent component
    useImperativeHandle(ref, () => ({
      focus: () => {
        const input = document.querySelector(
          'input[type="text"]',
        ) as HTMLInputElement;
        if (input) {
          input.focus();
        }
      },
    }));

    // Auto-focus on mount if enabled
    useEffect(() => {
      if (autoFocus) {
        const input = document.querySelector(
          'input[type="text"]',
        ) as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }
    }, [autoFocus]);

    // Trigger search when debounced value changes
    useEffect(() => {
      if (debouncedSearchTerm) {
        setIsResultLoading(true);
        setTimeout(() => {
          setIsResultLoading(false);
        }, 500);
      } else {
        setIsResultLoading(false);
      }
    }, [debouncedSearchTerm]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value || null);
    };

    // Handle clear search
    const handleClearSearch = useCallback(() => {
      setSearchTerm(null);
    }, [setSearchTerm]);

    // Handle click on the search container
    const handleContainerClick = () => {
      if (isClickable && onClick) {
        onClick();
      }
    };

    return (
      <motion.div
        className={cn(
          "flex h-[var(--search-header-height)] items-center px-4 py-2.5",
          isShowBack && "pr-4 pl-0",
        )}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="relative z-10">
          {isShowBack && (
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => {
                navigate({ to: "/home" });
              }}
            >
              <ChevronLeftIcon className="text-forground size-7" />
            </Button>
          )}
        </div>
        <div className="relative w-full" onClick={handleContainerClick}>
          <Input
            type="text"
            placeholder={t("pages.search.placeholder")}
            value={searchTerm || ""}
            onChange={handleSearchChange}
            className={cn(
              "bg-glass h-13 rounded-full border border-white/20 pl-10 text-base text-white placeholder:text-base focus-visible:ring-1 focus-visible:ring-white/40",
              isClickable && "cursor-pointer",
            )}
            readOnly={isClickable}
          />
          <SearchIcon className="absolute top-1/2 left-4 size-5 -translate-y-1/2" />
          {searchTerm && !isResultLoading && !isClickable && (
            <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2.5">
              <div
                className="flex cursor-pointer items-center justify-center rounded-full bg-white/10 p-1"
                onClick={handleClearSearch}
              >
                <XIcon className="size-4" />
              </div>
            </div>
          )}
          {isResultLoading && !isClickable && (
            <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin" />
          )}
        </div>
      </motion.div>
    );
  },
);

SearchHeader.displayName = "SearchHeader";

export default SearchHeader;
