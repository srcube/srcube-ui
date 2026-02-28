export const ACTION_SHEET_CANCEL_TEXT = {
  en: 'Cancel',
  'zh-CN': '取消',
  'zh-TW': '取消',
} as const;

export type ActionSheetLocale = keyof typeof ACTION_SHEET_CANCEL_TEXT;

export const DEFAULT_ACTION_SHEET_LOCALE: ActionSheetLocale = 'en';
