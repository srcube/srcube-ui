import {
  type ForegroundHex,
  normalizeColorString,
  pickReadableForeground,
  resolveBackgroundFromQuery,
} from './utils';

type MaybeNodeInfo = WechatMiniprogram.NodeInfo & {
  computedStyle?: Record<string, string | undefined>;
  backgroundColor?: string;
  ['background-color']?: string;
};

function resolveBackgroundFromInlineStyle(style?: string): string {
  if (!style) return '';
  const normalized = style.trim();
  if (!normalized) return '';

  const match = normalized.match(/(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+)/i);
  return match?.[1]?.trim() ?? '';
}

Component({
  properties: {
    className: { type: String, value: '' },
    style: { type: String, value: '' },
    fallbackForeground: { type: String, value: '#ffffff' },
    debug: { type: Boolean, value: false },
  },

  data: {
    foregroundColor: '#ffffff' as ForegroundHex,
    debugResolved: '',
    debugQuery: '',
    debugNormalized: '',
  },

  lifetimes: {
    attached() {
      this.scheduleResolve();
    },
    ready() {
      this.scheduleResolve();
    },
  },

  observers: {
    className() {
      this.scheduleResolve();
    },
    style() {
      this.scheduleResolve();
    },
  },

  methods: {
    scheduleResolve() {
      this.resolveBackground();
      setTimeout(() => this.resolveBackground(), 16);
      setTimeout(() => this.resolveBackground(), 60);
      setTimeout(() => this.resolveBackground(), 160);
    },

    resolveBackground() {
      wx.nextTick(() => {
        const query = this.createSelectorQuery();
        query
          .select('.contrastbox-root')
          .fields({ computedStyle: ['backgroundColor', 'background-color'], size: true, rect: true }, (node?: MaybeNodeInfo) => {
            const queryResolved = resolveBackgroundFromQuery(node);
            const inlineResolved = resolveBackgroundFromInlineStyle(this.data.style);
            const bg = queryResolved || inlineResolved || '';
            const fallback = (this.data.fallbackForeground || '#ffffff') as ForegroundHex;
            const normalized = normalizeColorString(bg);
            const foregroundColor = bg ? pickReadableForeground(bg) : fallback;
            this.setData({
              foregroundColor,
              debugResolved: bg || 'unknown',
              debugQuery: '',
              debugNormalized: normalized ? `${normalized.r},${normalized.g},${normalized.b}` : 'invalid',
            });
          })
          .exec();
      });
    },
  },
});
