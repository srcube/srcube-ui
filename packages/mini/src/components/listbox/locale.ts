export const LISTBOX_EMPTY_TEXT = {
  en: 'No items.',
  'zh-CN': '暂无内容',
  'zh-TW': '暫無內容',
} as const;

export type ListboxLocale = keyof typeof LISTBOX_EMPTY_TEXT;

export const DEFAULT_LISTBOX_LOCALE: ListboxLocale = 'en';
