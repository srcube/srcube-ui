import { UIComponent } from '../../shared/ui-component';
import { navbar } from '@srcube-ui/styles/components/navbar/style';
import type { NavbarMiniProps } from './props';
import { navbarMiniProps } from './props';

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

  const windowWidth = Number(windowInfo?.windowWidth ?? systemInfo.windowWidth ?? 0);
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
      safeTopHeight: statusBarHeight,
      capsuleHeight: 44,
      capsuleWidth: 88,
      sideInset: 12,
      debug: {
        statusBarHeight,
        windowWidth,
        safeArea: systemInfo.safeArea ?? null,
        menuButton: rawMenuButton,
        valid: false,
      },
    };
  }

  const verticalGap = Math.max(0, rawMenuButton.top - statusBarHeight);
  const capsuleHeight = Math.max(32, Math.round(rawMenuButton.height + verticalGap * 2));
  const capsuleWidth = Math.max(88, Math.round(rawMenuButton.width));
  const sideInset = Math.max(12, Math.round(windowWidth - rawMenuButton.right + 8));

  return {
    statusBarHeight,
    safeTopHeight: statusBarHeight,
    capsuleHeight,
    capsuleWidth,
    sideInset,
    debug: {
      statusBarHeight,
      windowWidth,
      safeArea: systemInfo.safeArea ?? null,
      menuButton: rawMenuButton,
      valid: true,
      verticalGap,
      capsuleHeight,
      capsuleWidth,
      sideInset,
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
    _safeTopHeight: 0,
    _capsuleHeight: 44,
    _capsuleWidth: 88,
    _sideInset: 12,
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
        _safeTopHeight: metrics.safeTopHeight,
        _capsuleHeight: metrics.capsuleHeight,
        _capsuleWidth: metrics.capsuleWidth,
        _sideInset: metrics.sideInset,
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
