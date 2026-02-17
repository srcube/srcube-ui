import { UIComponent } from '@srcube-ui/runtime/mini';
import { navbar } from '../style';
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
        size: data.size,
        isBordered: Boolean(data.isBordered),
        hasSafeTop: Boolean(data.hasSafeTop),
      });

      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        inner: slots.inner({ class: custom.inner }),
        start: slots.start({ class: custom.start }),
        title: slots.title({ class: custom.title }),
        end: slots.end({ class: custom.end }),
      };
    },
  },
});

export { navbar } from '../style';
export type { NavbarMiniProps } from './props';
export { navbarMiniProps } from './props';
