import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import En from "./en.json";
import Fr from "./fr.json";

const resources = {
  en: { translations: En },
  fr: { translations: Fr },
};

const options = {
  order: ["navigator", "cookie", "querystring", "sessionStorage", "localStorage"],
  lookupQuerystring: "lng",
};

const languages = ["en", "fr"];

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    detection: options,
    fallbackLng: "fr",
    lng: "fr",
    supportedLngs: languages,
    interpolation: { escapeValue: false },
    ns: ["translations"],
    defaultNS: "translations",
    parseMissingKeyHandler: (key) => {
      // console.log(`translation missing for "${key}"`);
      return key;
    },
  });

i18n.languages = languages;
i18n.changeLanguage();

if (i18n.language.startsWith("en-")) {
  i18n.changeLanguage("en");
} else {
  i18n.changeLanguage("fr");
}

export default i18n;
