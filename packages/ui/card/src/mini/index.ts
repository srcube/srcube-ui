import { UIComponent } from '@srcube-ui/runtime/mini';
import { card } from '../style';
import { cardMiniProps, type CardMiniProps } from './props';

type CardMiniData = CardMiniProps;

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties: cardMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  computed: {
    $classNames(data: CardMiniData) {
      const slots = card({
        size: data.size,
        radius: data.radius,
        shadow: data.shadow,
        isBordered: Boolean(data.isBordered),
      });
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        header: slots.header({ class: custom.header }),
        headerMain: slots.headerMain({ class: custom.headerMain }),
        title: slots.title({ class: custom.title }),
        description: slots.description({ class: custom.description }),
        startContent: slots.startContent({ class: custom.startContent }),
        endContent: slots.endContent({ class: custom.endContent }),
        body: slots.body({ class: custom.body }),
        footer: slots.footer({ class: custom.footer }),
        divider: slots.divider({ class: custom.divider }),
      };
    },
    $hasDefaultHeader(data: CardMiniData) {
      return Boolean(
        data.title || data.description || data.hasStartContent || data.hasEndContent,
      );
    },
    $hasTitleSection(data: CardMiniData) {
      return Boolean(data.title || data.description);
    },
    $hasHeader(data: CardMiniData) {
      return Boolean(
        data.hasHeader ||
          data.title ||
          data.description ||
          data.hasStartContent ||
          data.hasEndContent,
      );
    },
    $showHeaderDivider(data: CardMiniData) {
      const hasHeader = Boolean(
        data.hasHeader ||
          data.title ||
          data.description ||
          data.hasStartContent ||
          data.hasEndContent,
      );
      return Boolean(hasHeader && data.isHeaderDivider);
    },
    $showFooterDivider(data: CardMiniData) {
      return Boolean(data.hasFooter && data.isFooterDivider);
    },
  },
});

export { card } from '../style';
export type { CardMiniProps } from './props';
export { cardMiniProps } from './props';
