import type {UserConfig} from 'next-i18next/pages';
import zhCNCommon from '../public/locales/zh-CN/common.json';
import enCommon from '../public/locales/en/common.json';

export const defaultLocale = 'zh-CN';
export const locales = ['zh-CN', 'en'] as const;
export type AppLocale = typeof locales[number];

export const i18nConfig: UserConfig = {
    i18n: {
        defaultLocale,
        locales: [...locales],
    },
    resources: {
        'zh-CN': {
            common: zhCNCommon,
        },
        en: {
            common: enCommon,
        },
    },
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: defaultLocale,
    interpolation: {
        escapeValue: false,
    },
};

export function getLocaleCookie(): AppLocale {
    if (typeof document == 'undefined') {
        return defaultLocale;
    }
    let locale = document.cookie
        .split('; ')
        .find((item) => item.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];

    if (locale == 'zh-CN' || locale == 'en') {
        return locale;
    }
    return defaultLocale;
}

export function setLocaleCookie(locale: AppLocale) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}
