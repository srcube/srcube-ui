import { UIComponent } from '../../shared/ui-component';
import { navbar } from '@srcube-ui/styles/components/navbar/style';
import type { NavbarMiniProps } from './props';
import { navbarMiniProps } from './props';

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    navbarMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

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
    handleBackTap() {
      const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : [];
      const canBack = Array.isArray(pages) && pages.length > 1;

      this.triggerEvent('back', {
        canBack,
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
