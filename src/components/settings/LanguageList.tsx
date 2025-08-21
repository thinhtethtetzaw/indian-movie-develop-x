import i18n from "@/config/i18n";

const LANGUAGES = [
  { code: "en", name: "English", subtitle: "Default" },
  { code: "zh_cn", name: "简体中文", subtitle: "Chinese, Simplified" },
  { code: "zh_tw", name: "繁體中文", subtitle: "Chinese, Traditional" },
  { code: "ja", name: "日本語", subtitle: "Japanese" },
  { code: "ko", name: "한국어", subtitle: "Korean" },
];

interface Props {
  onSelect: (code: string) => void;
}

export function LanguageList({ onSelect }: Props) {
  const selectedLanguage = i18n.language;

  return (
    <div className="mx-auto mt-4 mb-10 w-full">
      {LANGUAGES.map(({ code, name, subtitle }) => {
        const isSelected = code === selectedLanguage;
        return (
          <button
            key={code}
            onClick={() => !isSelected && onSelect(code)}
            className="flex w-full justify-between border-b border-gray-700 p-4 text-left transition-colors last:border-b-0 hover:bg-gray-700/50"
          >
            <div className="flex flex-col">
              <span className="text-base font-medium text-white">{name}</span>
              <span className="text-sm text-gray-400">{subtitle}</span>
            </div>
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
