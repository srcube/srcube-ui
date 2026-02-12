import { UIComponent } from '@srcube-ui/mini';
import { tabPanel } from '../../style';
import type { TabPanelMiniProps } from './props';
import { tabPanelMiniProps } from './props';

type TabPanelMiniData = TabPanelMiniProps;

function resolveIsPanelActive(data: TabPanelMiniData): boolean {
  if (data.isActive !== null && data.isActive !== undefined) {
    return Boolean(data.isActive);
  }

  if (data.activeValue === null || data.activeValue === undefined) {
    return false;
  }

  return data.value === data.activeValue;
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    tabPanelMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  computed: {
    $isActive(data: TabPanelMiniData) {
      return resolveIsPanelActive(data);
    },
    $shouldRender(data: TabPanelMiniData) {
      return data.keepMounted ? true : resolveIsPanelActive(data);
    },
    $classNames(data: TabPanelMiniData) {
      const slots = tabPanel({
        isActive: resolveIsPanelActive(data),
      });
      const classNames = data.classNames ?? {};

      return {
        base: slots.base({
          class: [classNames.base, data.className],
        }),
      };
    },
  },
});

export { tabPanel } from '../../style';
export type { TabPanelMiniProps } from './props';
export { tabPanelMiniProps } from './props';
