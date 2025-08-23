import Sorting from "@/components/common/Sorting";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";

// Dropdown Trigger Button Component
interface DropdownTriggerProps {
  label: string;
  onClick: () => void;
}

function DropdownTrigger({ label, onClick }: DropdownTriggerProps) {
  return (
    <Button
      variant="ghost"
      className="bg-glass h-10 rounded-full !px-6"
      onClick={onClick}
    >
      {label}
      <ChevronDownIcon className="size-4" />
    </Button>
  );
}

// Sort Option Button Component
interface SortOptionButtonProps {
  option: { label: string; value: string };
  isSelected: boolean;
  onClick: () => void;
}

function SortOptionButton({
  option,
  isSelected,
  onClick,
}: SortOptionButtonProps) {
  return (
    <Button
      className={`w-full rounded-full px-3 !py-1 text-left text-sm transition-colors hover:bg-white/10 ${
        isSelected
          ? "bg-brand-red hover:bg-brand-red/80 text-white"
          : "text-white hover:bg-white/10"
      }`}
      variant="ghost"
      onClick={onClick}
    >
      {option.label}
    </Button>
  );
}

// Year Option Button Component
interface YearOptionButtonProps {
  year: number;
  isSelected: boolean;
  onClick: () => void;
}

function YearOptionButton({
  year,
  isSelected,
  onClick,
}: YearOptionButtonProps) {
  return (
    <Button
      className={`rounded-full px-3 !py-1 text-sm transition-colors ${
        isSelected
          ? "bg-brand-red hover:bg-brand-red/80 text-white"
          : "text-white hover:bg-white/10"
      }`}
      variant="ghost"
      onClick={onClick}
    >
      {year}
    </Button>
  );
}

const sortOptions = [
  { label: "Latest", value: "latest" },
  { label: "Popular", value: "popular" },
  { label: "A-Z", value: "asc" },
];

const years = [
  2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
];

export function Filter() {
  const [sortOrder, setSortOrder] = useQueryState(
    "sort_order",
    parseAsString.withDefault("asc"),
  );
  const [year, setYear] = useQueryState("year", parseAsString.withDefault(""));
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    year: false,
    sort: false,
  });
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen((prev) => ({ ...prev, year: false }));
      }
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen((prev) => ({ ...prev, sort: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (sortValue: string) => {
    setSortOrder(sortValue);
    setIsDropdownOpen((prev) => ({ ...prev, sort: false }));
  };

  const handleYearChange = (yearValue: string) => {
    setYear(yearValue);
    setIsDropdownOpen((prev) => ({ ...prev, year: false }));
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex w-full items-center justify-between gap-3">
        <span className="text-base font-medium text-[#CCCCCC]">Sort by</span>
        <div className="h-4 w-px bg-white/20"></div>
        <div className="flex items-center gap-x-3">
          {/* Sort Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <DropdownTrigger
              label={
                sortOptions.find((option) => option.value === sortOrder)
                  ?.label || ""
              }
              onClick={() => {
                setIsDropdownOpen((prev) => ({ ...prev, sort: !prev.sort }));
              }}
            />

            {isDropdownOpen.sort && (
              <div className="absolute top-full left-0 z-50 mt-1 w-full space-y-2.5 rounded-[20px] border border-white/16 bg-white/16 p-3 backdrop-blur-xl">
                {sortOptions.map((option) => (
                  <SortOptionButton
                    key={option.value}
                    option={option}
                    isSelected={sortOrder === option.value}
                    onClick={() => handleSortChange(option.value)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Year Dropdown */}
          <div className="relative" ref={yearDropdownRef}>
            <DropdownTrigger
              label={year || "Year"}
              onClick={() => {
                setIsDropdownOpen((prev) => ({ ...prev, year: !prev.year }));
              }}
            />

            {isDropdownOpen.year && (
              <div className="absolute top-full left-0 z-50 mt-1 w-48 rounded-[20px] border border-white/16 bg-white/16 p-3 backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-2">
                  {years.map((yearValue) => (
                    <YearOptionButton
                      key={yearValue}
                      year={yearValue}
                      isSelected={year === yearValue.toString()}
                      onClick={() => handleYearChange(yearValue.toString())}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <Sorting />
        </div>
      </div>
    </div>
  );
}
