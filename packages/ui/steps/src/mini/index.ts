import { UIComponent } from '@srcube-ui/runtime/mini';
import { type StepStatus, stepsStyle } from '../style';
import { stepsMiniProps, type StepsMiniItem, type StepsMiniProps } from './props';

type StepsMiniRenderItem = {
  key: string;
  title: string;
  description: string;
  iconText: string;
  classes: {
    item: string;
    indicatorWrap: string;
    indicator: string;
    line: string;
    content: string;
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

function resolveIconText(item: StepsMiniItem, status: StepStatus, index: number) {
  if (item.icon) {
    return item.icon;
  }

  if (status === 'finish') {
    return '✓';
  }

  if (status === 'error') {
    return '!';
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
        direction: data.direction,
        size: data.size,
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
      const direction = data.direction;
      const size = data.size;
      const isDot = Boolean(data.isDot);
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return items.map((rawItem, index) => {
        const item = normalizeItem(rawItem, index);
        const status = resolveStatus(item, index, current);
        const slots = stepsStyle({
          direction,
          size,
          isDot,
          status,
          isLast: index === items.length - 1,
        });

        return {
          key: String(item.key ?? index),
          title: String(item.title ?? ''),
          description: String(item.description ?? ''),
          iconText: isDot ? '' : resolveIconText(item, status, index),
          classes: {
            item: slots.item({ class: custom.item }),
            indicatorWrap: slots.indicatorWrap({ class: custom.indicatorWrap }),
            indicator: slots.indicator({ class: custom.indicator }),
            line: slots.line({ class: custom.line }),
            content: slots.content({ class: custom.content }),
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
