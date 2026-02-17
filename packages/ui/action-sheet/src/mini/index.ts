import { UIComponent } from '@srcube-ui/runtime/mini';
import { actionSheet, actionSheetActionState } from '../style';
import {
  actionSheetMiniProps,
  type ActionSheetMiniItem,
  type ActionSheetMiniProps,
  type ActionSheetMiniValue,
} from './props';

type ActionSheetMiniState = {
  _innerOpen: boolean;
};

type ActionSheetMiniData = ActionSheetMiniProps & ActionSheetMiniState;

function toItemArray(raw: unknown): ActionSheetMiniItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const candidate = item as ActionSheetMiniItem;
      return {
        value: candidate.value,
        label: String(candidate.label ?? ''),
        description: candidate.description ? String(candidate.description) : '',
        color: candidate.color === 'danger' ? 'danger' : 'default',
        isDisabled: candidate.isDisabled === true,
      };
    })
    .filter((item) => item.value !== null && item.value !== undefined);
}

function resolveOpen(data: ActionSheetMiniData) {
  return Boolean(data._innerOpen);
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    actionSheetMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerOpen: false,
  } satisfies ActionSheetMiniState,

  observers: {
    isOpen(nextOpen: boolean) {
      this.setData({
        _innerOpen: Boolean(nextOpen),
      } satisfies Partial<ActionSheetMiniState>);
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        _innerOpen: Boolean(this.data.isOpen || this.data.defaultOpen),
      } satisfies Partial<ActionSheetMiniState>);
    },
  },

  computed: {
    $classNames(data: ActionSheetMiniData) {
      const slots = actionSheet({
        size: data.size,
        radius: data.radius,
        isInset: Boolean(data.isInset),
      });
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        overlay: slots.overlay({ class: custom.overlay }),
        panel: slots.panel({ class: custom.panel }),
        header: slots.header({ class: custom.header }),
        title: slots.title({ class: custom.title }),
        description: slots.description({ class: custom.description }),
        list: slots.list({ class: custom.list }),
        action: slots.action({ class: custom.action }),
        actionLabel: slots.actionLabel({ class: custom.actionLabel }),
        actionDescription: slots.actionDescription({ class: custom.actionDescription }),
        cancel: slots.cancel({ class: custom.cancel }),
      };
    },
    $isOpen(data: ActionSheetMiniData) {
      return resolveOpen(data);
    },
    $renderActions(data: ActionSheetMiniData) {
      const actions = toItemArray(data.actions);
      return actions.map((item, index) => ({
        ...item,
        index,
        key: `${typeof item.value}:${String(item.value)}`,
        actionState: actionSheetActionState({
          color: item.color,
          isDisabled: Boolean(item.isDisabled),
        }),
      }));
    },
  },

  methods: {
    closeSheet() {
      this.setData({
        _innerOpen: false,
      } satisfies Partial<ActionSheetMiniState>);
      this.triggerEvent('change', {
        isOpen: false,
      });
    },

    handleOverlayTap() {
      if (!this.data.shouldCloseOnOverlayPress) {
        return;
      }

      this.closeSheet();
      this.triggerEvent('cancel');
    },

    handleCancelTap() {
      this.closeSheet();
      this.triggerEvent('cancel');
    },

    handleActionTap(
      e: WechatMiniprogram.TouchEvent & {
        currentTarget: {
          dataset: {
            index?: number;
          };
        };
      },
    ) {
      const index = Number(e.currentTarget?.dataset?.index);
      if (Number.isNaN(index)) {
        return;
      }

      const actions = toItemArray(this.data.actions);
      const target = actions[index];
      if (!target || target.isDisabled) {
        return;
      }

      this.triggerEvent('action', {
        value: target.value as ActionSheetMiniValue,
        index,
        item: target,
      });

      this.closeSheet();
    },
  },
});

export { actionSheet } from '../style';
export type {
  ActionSheetMiniItem,
  ActionSheetMiniProps,
  ActionSheetMiniValue,
} from './props';
export { actionSheetMiniProps } from './props';
