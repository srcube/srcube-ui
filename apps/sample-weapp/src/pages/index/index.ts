import {
  resolveSampleTone,
  type SampleTone,
} from '../../shared/sample-theme';
import { updateGlobalSampleTone } from '../../shared/sample-theme-page';

type SampleApp = WechatMiniprogram.App.Instance<{
  globalData: {
    sampleTone: SampleTone;
  };
  subscribeSampleTone?: (listener: (tone: SampleTone) => void) => () => void;
}>;

function resolvePageClassName(tone: SampleTone) {
  return tone === 'dark'
    ? 'min-h-screen bg-zinc-950 text-zinc-50 pb-safe'
    : 'min-h-screen bg-slate-50 text-slate-900 pb-safe';
}

function resolveCardClassName(tone: SampleTone) {
  return tone === 'dark'
    ? 'flex justify-center rounded-lg border border-zinc-800 bg-zinc-900 py-2 font-medium shadow-sm active:bg-zinc-800'
    : 'flex justify-center rounded-lg bg-white py-2 font-medium shadow-sm active:bg-slate-200';
}

function resolveSubTitleClassName(tone: SampleTone) {
  return tone === 'dark' ? 'text-xs text-zinc-400' : 'text-xs text-slate-500';
}

function resolveFooterClassName(tone: SampleTone) {
  return tone === 'dark'
    ? 'bg-zinc-900 px-6 py-3 text-center text-zinc-400 text-xs border-t border-zinc-800'
    : 'bg-white px-6 py-3 text-center text-slate-500 text-xs border-t border-slate-200';
}

Page({
  data: {
    tone: 'default' as SampleTone,
    pageClassName: resolvePageClassName('default'),
    cardClassName: resolveCardClassName('default'),
    subTitleClassName: resolveSubTitleClassName('default'),
    footerClassName: resolveFooterClassName('default'),
    isToneSheetOpen: false,
    toneActions: [
      { value: 'default', label: 'Light', description: 'Bright surfaces' },
      { value: 'dark', label: 'Dark', description: 'Dark zinc surfaces' },
    ],
    components: [
      {
        title: 'Theme Center',
        url: '/pages/theme/index',
      },
      {
        title: 'Action Sheet',
        url: '/packages/action-sheet/pages/sample/index',
      },
      {
        title: 'Avatar',
        url: '/packages/avatar/pages/sample/index',
      },
      {
        title: 'Button',
        url: '/packages/button/pages/sample/index',
      },
      {
        title: 'Calendar',
        url: '/packages/calendar/pages/sample/index',
      },
      {
        title: 'Card',
        url: '/packages/card/pages/sample/index',
      },
      {
        title: 'Checkbox',
        url: '/packages/checkbox/pages/sample/index',
      },
      {
        title: 'Collapse',
        url: '/packages/collapse/pages/sample/index',
      },
      {
        title: 'Drawer',
        url: '/packages/drawer/pages/sample/index',
      },
      {
        title: 'Field',
        url: '/packages/field/pages/sample/index',
      },
      {
        title: 'Image',
        url: '/packages/image/pages/sample/index',
      },
      {
        title: 'Input',
        url: '/packages/input/pages/sample/index',
      },
      {
        title: 'Input OTP',
        url: '/packages/input-otp/pages/sample/index',
      },
      {
        title: 'Listbox',
        url: '/packages/listbox/pages/sample/index',
      },
      {
        title: 'Popup',
        url: '/packages/popup/pages/sample/index',
      },
      {
        title: 'Navbar',
        url: '/packages/navbar/pages/sample/index',
      },
      {
        title: 'Notice Bar',
        url: '/packages/notice-bar/pages/sample/index',
      },
      {
        title: 'Pickbox',
        url: '/packages/pickbox/pages/sample/index',
      },
      {
        title: 'Picker',
        url: '/packages/picker/pages/sample/index',
      },
      {
        title: 'Menu',
        url: '/packages/menu/pages/sample/index',
      },
      {
        title: 'Radio',
        url: '/packages/radio/pages/sample/index',
      },
      {
        title: 'Scrollbox',
        url: '/packages/scrollbox/pages/sample/index',
      },
      {
        title: 'Selectbox',
        url: '/packages/selectbox/pages/sample/index',
      },
      {
        title: 'Skeleton',
        url: '/packages/skeleton/pages/sample/index',
      },
      {
        title: 'Stepper',
        url: '/packages/stepper/pages/sample/index',
      },
      {
        title: 'Steps',
        url: '/packages/steps/pages/sample/index',
      },
      {
        title: 'Swipe Action',
        url: '/packages/swipe-action/pages/sample/index',
      },
      {
        title: 'Switch',
        url: '/packages/switch/pages/sample/index',
      },
      {
        title: 'Tabbar',
        url: '/packages/tabbar/pages/sample/index',
      },
      {
        title: 'Tabs',
        url: '/packages/tabs/pages/sample/index',
      },
      {
        title: 'Textarea',
        url: '/packages/textarea/pages/sample/index',
      },
      {
        title: 'Timeline',
        url: '/packages/timeline/pages/sample/index',
      },
      {
        title: 'Tour',
        url: '/packages/tour/pages/sample/index',
      },
      {
        title: 'Toaster',
        url: '/packages/toaster/pages/sample/index',
      },
      {
        title: 'Uploader',
        url: '/packages/uploader/pages/sample/index',
      },
    ],
  },

  _unsubscribeTone: null as null | (() => void),

  applyTone(tone: SampleTone) {
    this.setData({
      tone,
      pageClassName: resolvePageClassName(tone),
      cardClassName: resolveCardClassName(tone),
      subTitleClassName: resolveSubTitleClassName(tone),
      footerClassName: resolveFooterClassName(tone),
    });
  },

  onLoad() {
    const app = getApp<SampleApp>();
    const tone = resolveSampleTone(app.globalData?.sampleTone);
    this.applyTone(tone);

    this._unsubscribeTone = app.subscribeSampleTone?.((nextTone) => {
      this.applyTone(nextTone);
    }) ?? null;
  },

  onUnload() {
    this._unsubscribeTone?.();
    this._unsubscribeTone = null;
  },

  handleOpenToneSheet() {
    this.setData({ isToneSheetOpen: true });
  },

  handleToneSheetChange(event: WechatMiniprogram.CustomEvent<{ isOpen?: boolean }>) {
    this.setData({ isToneSheetOpen: Boolean(event.detail?.isOpen) });
  },

  handleToneAction(event: WechatMiniprogram.CustomEvent<{ value?: SampleTone }>) {
    updateGlobalSampleTone(resolveSampleTone(event.detail?.value));
    this.setData({ isToneSheetOpen: false });
  },

  handleNavigate(e: WechatMiniprogram.TouchEvent) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  },
});
