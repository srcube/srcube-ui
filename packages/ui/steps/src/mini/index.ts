import { UIComponent } from '@srcube-ui/runtime/mini';
import { type StepStatus, stepsStyle } from '../style';
import { stepsMiniProps, type StepsMiniItem, type StepsMiniProps } from './props';

type StepsMiniRenderItem = {
  key: string;
  title: string;
  description: string;
  hasDescription: boolean;
  topSpacerText: string;
  bottomSpacerText: string;
  iconText: string;
  isStatusIcon: boolean;
  classes: {
    item: string;
    indicatorWrap: string;
    indicator: string;
    indicatorIcon: string;
    indicatorText: string;
    lineStart: string;
    lineEnd: string;
    content: string;
    titleSpacer: string;
    title: string;
    description: string;
  };
};

function normalizeItem(rawItem: unknown, index: number): StepsMiniItem {
  if (!rawItem || typeof rawItem !== 'object') {
    return {
      key: String(index),
      title: `Step ${index + 1}`,
    };
  }

  const item = rawItem as StepsMiniItem;
  const title =
    typeof item.title === 'string' && item.title.trim().length > 0
      ? item.title
      : `Step ${index + 1}`;

  return {
    key: item.key ?? String(index),
    title,
    description: typeof item.description === 'string' ? item.description : '',
    icon: typeof item.icon === 'string' ? item.icon : '',
    status: item.status,
  };
}

function resolveStatus(item: StepsMiniItem, index: number, current: number): StepStatus {
  if (item.status) {
    return item.status;
  }

  if (index < current) {
    return 'finish';
  }

  if (index === current) {
    return 'process';
  }

  return 'wait';
}

function resolveIconText(item: StepsMiniItem, index: number) {
  if (item.icon) {
    return item.icon;
  }

  return String(index + 1);
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties: stepsMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  computed: {
    $classNames(data: StepsMiniProps) {
      const slots = stepsStyle({
        orientation: data.orientation,
        size: data.size,
        color: data.color,
        variant: data.variant,
        isDot: Boolean(data.isDot),
      });
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        list: slots.list({ class: custom.list }),
      };
    },

    $renderItems(data: StepsMiniProps): StepsMiniRenderItem[] {
      const items = Array.isArray(data.items) ? data.items : [];
      const current = Number.isFinite(Number(data.current))
        ? Number(data.current)
        : 0;
      const size = data.size;
      const color = data.color;
      const variant = data.variant;
      const isDot = Boolean(data.isDot);
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return items.map((rawItem, index) => {
        const item = normalizeItem(rawItem, index);
        const description = String(item.description ?? '');
        const hasDescription = description.length > 0;
        const status = resolveStatus(item, index, current);
        const isStatusIcon =
          !isDot &&
          !item.icon &&
          (status === 'finish' || status === 'error');
        const iconText = isDot || isStatusIcon ? '' : resolveIconText(item, index);
        const slots = stepsStyle({
          orientation: data.orientation,
          size,
          color,
          variant,
          isDot,
          status,
          isLast: index === items.length - 1,
          isFirst: index === 0,
        });

        return {
          key: String(item.key ?? index),
          title: String(item.title ?? ''),
          description,
          hasDescription,
          topSpacerText: hasDescription ? description : 'placeholder',
          bottomSpacerText: 'placeholder',
          iconText,
          isStatusIcon,
          classes: {
            item: slots.item({ class: custom.item }),
            indicatorWrap: slots.indicatorWrap({ class: custom.indicatorWrap }),
            indicator: slots.indicator({ class: custom.indicator }),
            indicatorIcon: slots.indicatorIcon({ class: custom.indicatorIcon }),
            indicatorText: slots.indicatorText({ class: custom.indicatorText }),
            lineStart: slots.lineStart({
              class: [custom.line, custom.lineStart],
            }),
            lineEnd: slots.lineEnd({
              class: [custom.line, custom.lineEnd],
            }),
            content: slots.content({ class: custom.content }),
            titleSpacer: slots.titleSpacer({ class: custom.titleSpacer }),
            title: slots.title({ class: custom.title }),
            description: slots.description({ class: custom.description }),
          },
        } satisfies StepsMiniRenderItem;
      });
    },
  },
});

export { stepsStyle } from '../style';
export type { StepsMiniItem, StepsMiniProps } from './props';
export { stepsMiniProps } from './props';
