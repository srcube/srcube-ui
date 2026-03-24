import { UIComponent } from '../../shared/ui-component';
import { navbar } from '@srcube-ui/styles/components/navbar/style';
import type { NavbarMiniProps } from './props';
import { navbarMiniProps } from './props';

type MenuButtonMetrics = {
  top: number;
  height: number;
  width: number;
  right: number;
};

function readNavbarMetrics() {
  const windowInfo = wx.getWindowInfo?.();
  const systemInfo = windowInfo ?? wx.getSystemInfoSync();
  const statusBarHeight = Number(systemInfo.statusBarHeight ?? 0);

  let menuButton: WechatMiniprogram.Rect | null = null;
  try {
    menuButton = wx.getMenuButtonBoundingClientRect?.() ?? null;
  } catch {
    menuButton = null;
  }

  const rawMenuButton = menuButton
    ? {
        width: Number(menuButton.width ?? 0),
        height: Number(menuButton.height ?? 0),
        top: Number(menuButton.top ?? 0),
        right: Number(menuButton.right ?? 0),
        bottom: Number(menuButton.bottom ?? 0),
        left: Number(menuButton.left ?? 0),
      }
    : null;

  const isValidMenuButton = Boolean(
    rawMenuButton &&
      rawMenuButton.width > 0 &&
      rawMenuButton.height > 0 &&
      rawMenuButton.top > 0 &&
      rawMenuButton.right > 0,
  );

  if (!isValidMenuButton || !rawMenuButton) {
    return {
      statusBarHeight,
      contentHeight: 44,
      horizontalInset: 12,
      debug: {
        statusBarHeight,
        windowWidth: Number(windowInfo?.windowWidth ?? systemInfo.windowWidth ?? 0),
        safeArea: systemInfo.safeArea ?? null,
        menuButton: rawMenuButton,
        valid: false,
      },
    };
  }

  const verticalGap = Math.max(0, rawMenuButton.top - statusBarHeight);
  const contentHeight = Math.max(44, Math.round(rawMenuButton.height + verticalGap * 2));
  const rightInset = windowInfo
    ? Math.max(12, Math.round(windowInfo.windowWidth - rawMenuButton.right + 8))
    : 12;
  const horizontalInset = Math.max(12, rightInset + rawMenuButton.width);

  return {
    statusBarHeight,
    contentHeight,
    horizontalInset,
    debug: {
      statusBarHeight,
      windowWidth: Number(windowInfo?.windowWidth ?? systemInfo.windowWidth ?? 0),
      safeArea: systemInfo.safeArea ?? null,
      menuButton: rawMenuButton,
      valid: true,
      verticalGap,
      rightInset,
      contentHeight,
      horizontalInset,
    },
  };
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    navbarMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _contentHeight: 48,
    _horizontalInset: 56,
    _debugMetrics: '',
  },

  lifetimes: {
    attached() {
      this.syncMetrics('attached');
    },
    ready() {
      this.syncMetrics('ready');
      setTimeout(() => this.syncMetrics('t+80'), 80);
      setTimeout(() => this.syncMetrics('t+180'), 180);
    },
  },

  computed: {
    $classNames(data: NavbarMiniProps) {
      const slots = navbar({
        tone: data.tone,
        size: data.size,
        isBordered: Boolean(data.isBordered),
        hasSafeTop: Boolean(data.hasSafeTop),
        titleAlign: data.titleAlign,
      });

      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      const contentHeight = Number((data as typeof data & { _contentHeight?: number })._contentHeight ?? 48);
      const horizontalInset = Number((data as typeof data & { _horizontalInset?: number })._horizontalInset ?? 56);

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        inner: slots.inner({ class: custom.inner }),
        start: slots.start({ class: custom.start }),
        title: slots.title({ class: custom.title }),
        end: slots.end({ class: custom.end }),
        placeholder: slots.placeholder({ class: custom.placeholder }),
        back: slots.back({ class: custom.back }),
        iBack: slots._iBack(),
      };
    },
  },

  methods: {
    syncMetrics(stage = 'unknown') {
      const metrics = readNavbarMetrics();
      this.setData({
        _contentHeight: metrics.contentHeight,
        _horizontalInset: metrics.horizontalInset,
        _debugMetrics: JSON.stringify({ stage, ...metrics.debug }),
      });
    },

    handleBackTap() {
      const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : [];
      const canBack = Array.isArray(pages) && pages.length > 1;

      this.triggerEvent('back', {
        canBack,
        debugMetrics: this.data._debugMetrics,
      });

      if (!canBack) {
        return;
      }

      wx.navigateBack({
        delta: 1,
      });
    },
  },
});

export { navbar } from '@srcube-ui/styles/components/navbar/style';
export type { NavbarMiniProps } from './props';
export { navbarMiniProps } from './props';
