import ArrowUpLeftIcon from "@/assets/svgs/icon-arrow-up-left.svg?react";
import type { SearchSuggestionResponse } from "@/types/api-schema/response";
import { motion } from "motion/react";

interface SearchSuggestionsProps {
  suggestions: SearchSuggestionResponse[];
  searchTerm: string;
  onSuggestionClick: (suggestion: SearchSuggestionResponse) => void;
}

// Helper function to highlight matching text
const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm) return { highlighted: text, remaining: "" };

  const lowerText = text.toLowerCase();
  const lowerSearchTerm = searchTerm.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerSearchTerm);

  if (matchIndex === -1) return { highlighted: "", remaining: text };

  const highlighted = text.substring(
    matchIndex,
    matchIndex + searchTerm.length,
  );
  const remaining = text.substring(matchIndex + searchTerm.length);

  return { highlighted, remaining };
};

export function SearchSuggestions({
  suggestions,
  searchTerm,
  onSuggestionClick,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="px-4"
    >
      <div className="space-y-0">
        {suggestions.map((suggestion, index) => {
          const { highlighted, remaining } = highlightText(
            suggestion.text || "",
            searchTerm,
          );
          return (
            <motion.div
              key={suggestion.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group flex cursor-pointer items-center justify-between border-b border-[#222222] py-4 transition-colors last:border-b-0"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <div className="flex-1">
                <span className="text-brand-red text-sm font-semibold">
                  {highlighted}
                </span>
                <span className="text-sm font-semibold text-white">
                  {remaining}
                </span>
              </div>
              <ArrowUpLeftIcon className="h-4 w-4 text-white/60 transition-transform duration-300 ease-in-out group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
