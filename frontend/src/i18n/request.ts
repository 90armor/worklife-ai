import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const SUPPORTED_LOCALES = ["en", "ja"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function isSupportedLocale(value: string | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export default getRequestConfig(async () => {
  // Locale is read from a cookie (worklife_locale). Defaults to "en".
  // A language-switcher UI that sets this cookie is a follow-up task.
  const raw = cookies().get("worklife_locale")?.value;
  const locale: Locale = isSupportedLocale(raw) ? raw : "en";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
