import { UIComponent } from '../../shared/ui-component';
import { card } from '@srcube-ui/styles/components/card/style';
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
        color: data.color,
        size: data.size,
        radius: data.radius,
      });
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        header: slots.header({ class: custom.header }),
        body: slots.body({ class: custom.body }),
        footer: slots.footer({ class: custom.footer }),
      };
    },
  },
});

export { card } from '@srcube-ui/styles/components/card/style';
export type { CardMiniProps } from './props';
export { cardMiniProps } from './props';
