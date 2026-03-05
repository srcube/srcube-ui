import { UIComponent } from '../../shared/ui-component';
import { skeletonStyle } from '@srcube-ui/styles/components/skeleton/style';
import type { SkeletonMiniProps } from './props';
import { skeletonMiniProps } from './props';

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    skeletonMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  computed: {
    $classNames(data: SkeletonMiniProps) {
      const slots = skeletonStyle({
        radius: data.radius ?? undefined,
        isLoaded: Boolean(data.isLoaded),
      });

      const custom = (data.classNames ?? {}) as Record<
        string,
        string | undefined
      >;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        content: slots.content({ class: custom.content }),
        placeholder: slots.placeholder({ class: custom.placeholder }),
      };
    },
  },
});

export { skeletonStyle } from '@srcube-ui/styles/components/skeleton/style';
export type { SkeletonMiniProps } from './props';
export { skeletonMiniProps } from './props';
