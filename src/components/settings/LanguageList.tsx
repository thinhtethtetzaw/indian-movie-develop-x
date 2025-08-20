// Define the language data outside of the component to prevent re-creation on every render.
const LANGUAGES = [
  { code: "en", name: "English", subtitle: "Default" },
  { code: "zh-CN", name: "简体中文", subtitle: "Chinese, Simplified" },
  { code: "zh-TW", name: "繁體中文", subtitle: "Chinese, Traditional" },
  { code: "ja", name: "日本語", subtitle: "Japanese" },
  { code: "ko", name: "한국어", subtitle: "Korean" },
];

type LanguageListProps = {
  selectedLanguage?: string;
  onSelect?: (code: string) => void;
};

export function LanguageList({
  selectedLanguage,
  onSelect,
}: LanguageListProps) {
  const safeSelectedLanguage = selectedLanguage ?? "";
  const safeOnSelect = onSelect ?? (() => {});

  return (
    <div className="mx-auto w-full p-4">
      {LANGUAGES?.map((language) => {
        const isSelected = safeSelectedLanguage === language?.code;
        return (
          <button
            key={language?.code || "unknown"}
            onClick={() => safeOnSelect(language?.code || "")}
            className="flex w-full items-center justify-between border-b border-gray-700 px-0 py-4 text-left transition-colors last:border-b-0 hover:bg-gray-700/50"
            disabled={!language?.code}
          >
            <div className="flex flex-col">
              <span className="text-base font-medium text-white">
                {language?.name || "Unknown Language"}
              </span>
              <span className="text-sm text-gray-400">
                {language?.subtitle || ""}
              </span>
            </div>
            {/* Conditional rendering for the checkmark with error handling */}
            <div className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-red-500">
              {isSelected && (
                <div className="h-3 w-3 rounded-full bg-red-500" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
