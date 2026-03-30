import { useLanguage } from "../pages/LanguageContext";
import { translateText } from "./translations";

export const useTranslations = () => {
  const { language } = useLanguage();

  return {
    language,
    t: (key: string) => translateText(language, key),
  };
};
