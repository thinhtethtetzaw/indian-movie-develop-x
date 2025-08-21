import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json"; /** English */
import ja from "../locales/ja.json"; /** Japanese */
import ko from "../locales/ko.json"; /** Korean */
import zh_cn from "../locales/zh-cn.json"; /** Chinese Simplified */
import zh_tw from "../locales/zh-tw.json"; /** Chinese Traditional */

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh_cn: { translation: zh_cn },
      zh_tw: { translation: zh_tw },
      ja: { translation: ja },
      ko: { translation: ko },
    },
    fallbackLng: "en",
    debug: import.meta.env.MODE === "development",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
