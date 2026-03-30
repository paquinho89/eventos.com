export const COOKIE_PREFS_KEY = "cookie_preferences";
export const COOKIE_CONSENT_UPDATED_EVENT = "cookie-consent-updated";

export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  updatedAt: string;
};

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  preferences: false,
  updatedAt: "",
};

const ANALYTICS_COOKIE_NAMES = [
  "_ga",
  "_gid",
  "_gat",
  "_ga_*",
];

const PREFERENCE_COOKIE_NAMES = [
  "lang",
  "locale",
  "theme",
  "ui_prefs",
];

function clearCookieByName(name: string) {
  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
  const hostname = window.location.hostname;

  document.cookie = `${name}=; expires=${expires}; path=/;`;
  document.cookie = `${name}=; expires=${expires}; path=/; domain=${hostname};`;
  document.cookie = `${name}=; expires=${expires}; path=/; domain=.${hostname};`;
}

function clearCookiesMatching(names: string[]) {
  const allCookies = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter(Boolean);

  names.forEach((namePattern) => {
    const wildcard = namePattern.endsWith("*");
    const baseName = wildcard ? namePattern.slice(0, -1) : namePattern;

    allCookies.forEach((cookieName) => {
      const matches = wildcard
        ? cookieName.startsWith(baseName)
        : cookieName === baseName;

      if (matches) {
        clearCookieByName(cookieName);
      }
    });
  });
}

function removeAnalyticsScripts() {
  const scriptIds = ["ga-script", "ga-inline-script"];
  scriptIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });

  delete (window as any).gtag;
  delete (window as any).dataLayer;
}

function ensureGoogleAnalyticsLoaded() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
  if (!measurementId) {
    return;
  }

  if (document.getElementById("ga-script")) {
    return;
  }

  const gaScript = document.createElement("script");
  gaScript.id = "ga-script";
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(gaScript);

  const inlineScript = document.createElement("script");
  inlineScript.id = "ga-inline-script";
  inlineScript.text = [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag = gtag;",
    "gtag('js', new Date());",
    `gtag('config', '${measurementId}');`,
  ].join("\n");
  document.head.appendChild(inlineScript);
}

export function getCookiePreferences(): CookiePreferences {
  try {
    const raw = localStorage.getItem(COOKIE_PREFS_KEY);
    if (!raw) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(raw);
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      preferences: Boolean(parsed.preferences),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function setCookiePreferences(analytics: boolean, preferences: boolean) {
  const payload: CookiePreferences = {
    necessary: true,
    analytics,
    preferences,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(payload));
  applyCookieConsentEffects(payload);
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: payload }));
}

export function applyCookieConsentEffects(prefs: CookiePreferences = getCookiePreferences()) {
  if (!prefs.analytics) {
    clearCookiesMatching(ANALYTICS_COOKIE_NAMES);
    removeAnalyticsScripts();
  } else {
    ensureGoogleAnalyticsLoaded();
  }

  if (!prefs.preferences) {
    clearCookiesMatching(PREFERENCE_COOKIE_NAMES);
    localStorage.removeItem("ui_prefs");
    localStorage.removeItem("lang");
  }
}
