"use client";

import { useLocale } from "./LocaleProvider";

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className="text-xs text-[#5a5870] hover:text-[#e8e6f0] transition-colors duration-200 px-2 py-1 rounded-md border border-white/[0.06] hover:border-white/[0.15]"
      title={locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
    >
      {locale === "en" ? "AR" : "EN"}
    </button>
  );
}
