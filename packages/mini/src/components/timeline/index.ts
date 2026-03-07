import {
  type TimelineColor,
  timelineStyle,
} from '@srcube-ui/styles/components/timeline/style';
import { UIComponent } from '../../shared/ui-component';
import {
  type TimelineMiniItem,
  type TimelineMiniProps,
  timelineMiniProps,
} from './props';

type TimelineRenderItem = {
  key: string;
  title: string;
  time: string;
  description: string;
  icon: string;
  classes: {
    item: string;
    indicatorWrap: string;
    node: string;
    icon: string;
    lineStart: string;
    lineEnd: string;
    content: string;
    title: string;
    time: string;
    description: string;
  };
};

function normalizeItem(rawItem: unknown, index: number): TimelineMiniItem {
  if (!rawItem || typeof rawItem !== 'object') {
    return {
      key: String(index),
      title: `Event ${index + 1}`,
    };
  }

  const item = rawItem as TimelineMiniItem;
  const title =
    typeof item.title === 'string' && item.title.trim().length > 0
      ? item.title
      : `Event ${index + 1}`;

  return {
    key: item.key ?? String(index),
    title,
    description: typeof item.description === 'string' ? item.description : '',
    time: typeof item.time === 'string' ? item.time : '',
    icon: typeof item.icon === 'string' ? item.icon : '',
    color: item.color,
    isPending: Boolean(item.isPending),
  };
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    timelineMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  computed: {
    $classNames(data: TimelineMiniProps) {
      const slots = timelineStyle({
        size: data.size,
        color: data.color,
        lineStyle: data.lineStyle,
      });
      const custom = (data.classNames ?? {}) as Record<
        string,
        string | undefined
      >;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        list: slots.list({ class: custom.list }),
      };
    },

    $renderItems(data: TimelineMiniProps): TimelineRenderItem[] {
      const items = Array.isArray(data.items) ? data.items : [];
      const baseColor = (data.color ?? 'default') as TimelineColor;
      const custom = (data.classNames ?? {}) as Record<
        string,
        string | undefined
      >;

      return items.map((rawItem, index) => {
        const item = normalizeItem(rawItem, index);
        const slots = timelineStyle({
          size: data.size,
          color: (item.color ?? baseColor) as TimelineColor,
          lineStyle: data.lineStyle,
          isPending: Boolean(item.isPending),
          isLast: index === items.length - 1,
          isFirst: index === 0,
        });

        return {
          key: String(item.key ?? index),
          title: String(item.title ?? ''),
          time: String(item.time ?? ''),
          description: String(item.description ?? ''),
          icon: String(item.icon ?? ''),
          classes: {
            item: slots.item({ class: custom.item }),
            indicatorWrap: slots.indicatorWrap({ class: custom.indicatorWrap }),
            node: slots.node({ class: custom.node }),
            icon: slots.icon({ class: custom.icon }),
            lineStart: slots.lineStart({ class: custom.lineStart }),
            lineEnd: slots.lineEnd({ class: custom.lineEnd }),
            content: slots.content({ class: custom.content }),
            title: slots.title({ class: custom.title }),
            time: slots.time({ class: custom.time }),
            description: slots.description({ class: custom.description }),
          },
        } satisfies TimelineRenderItem;
      });
    },
  },
});

export { timelineStyle } from '@srcube-ui/styles/components/timeline/style';
export type { TimelineMiniItem, TimelineMiniProps } from './props';
export { timelineMiniProps } from './props';
