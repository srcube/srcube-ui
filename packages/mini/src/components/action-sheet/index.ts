import { UIComponent } from '../../shared/ui-component';
import {
  ACTION_SHEET_CANCEL_TEXT,
  DEFAULT_ACTION_SHEET_LOCALE,
  type ActionSheetLocale,
} from './locale';
import {
  actionSheet,
  actionSheetAction,
  type ActionSheetActionColor,
} from '@srcube-ui/styles/components/action-sheet/style';
import {
  actionSheetMiniProps,
  type ActionSheetCancelButtonMiniProps,
  type ActionSheetMiniItem,
  type ActionSheetMiniProps,
  type ActionSheetMiniValue,
} from './props';

type ActionSheetMiniState = {
  _innerOpen: boolean;
};

type ActionSheetMiniData = ActionSheetMiniProps & ActionSheetMiniState;
type ActionSheetResolvedCancelButtonProps = {
  buttonId: string;
  color: ActionSheetActionColor | null;
  tone: 'light' | 'dark' | null;
  variant: 'solid' | 'outline' | 'flat' | 'text' | null;
  size: NonNullable<ActionSheetMiniProps['size']> | null;
  radius: NonNullable<ActionSheetMiniProps['radius']> | null;
  isBlock: boolean;
  isDisabled: boolean;
  isLoading: boolean | 'auto';
  className: string;
  style: string;
  hoverClass: string;
  hoverStopPropagation: boolean;
  hoverStartTime: number | null;
  hoverStayTime: number | null;
  ariaLabel: string;
};

const DEFAULT_ACTION_COLOR: ActionSheetActionColor = 'default';

function normalizeActionColor(value: unknown): ActionSheetActionColor {
  switch (value) {
    case 'primary':
    case 'secondary':
    case 'success':
    case 'warning':
    case 'danger':
      return value;
    default:
      return 'default';
  }
}

function normalizeSize(
  value: unknown,
): NonNullable<ActionSheetMiniProps['size']> {
  switch (value) {
    case 'sm':
    case 'lg':
      return value;
    default:
      return 'md';
  }
}

function resolveRadiusBySize(size: NonNullable<ActionSheetMiniProps['size']>) {
  switch (size) {
    case 'sm':
      return 'sm';
    case 'lg':
      return 'lg';
    default:
      return 'md';
  }
}

function normalizeRadius(
  value: unknown,
  fallbackSize: NonNullable<ActionSheetMiniProps['size']>,
): NonNullable<ActionSheetMiniProps['radius']> {
  switch (value) {
    case 'none':
    case 'sm':
    case 'md':
    case 'lg':
    case 'full':
      return value;
    default:
      return resolveRadiusBySize(fallbackSize);
  }
}

function normalizeLocale(value: unknown): ActionSheetLocale {
  if (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(ACTION_SHEET_CANCEL_TEXT, value)
  ) {
    return value as ActionSheetLocale;
  }

  return DEFAULT_ACTION_SHEET_LOCALE;
}

function normalizeButtonVariant(value: unknown) {
  switch (value) {
    case 'solid':
    case 'outline':
    case 'flat':
    case 'text':
      return value;
    default:
      return null;
  }
}

function normalizeButtonTone(value: unknown) {
  switch (value) {
    case 'light':
    case 'dark':
      return value;
    default:
      return null;
  }
}

function normalizeButtonRadius(value: unknown) {
  switch (value) {
    case 'none':
    case 'sm':
    case 'md':
    case 'lg':
    case 'full':
      return value;
    default:
      return null;
  }
}

function normalizeButtonLoading(value: unknown): boolean | 'auto' {
  if (value === 'auto') {
    return 'auto';
  }

  return value === true;
}

function toCancelButtonProps(
  raw: unknown,
): ActionSheetResolvedCancelButtonProps {
  if (!raw || typeof raw !== 'object') {
    return {
      buttonId: '',
      color: null,
      tone: null,
      variant: null,
      size: null,
      radius: null,
      isBlock: true,
      isDisabled: false,
      isLoading: false,
      className: '',
      style: '',
      hoverClass: '',
      hoverStopPropagation: false,
      hoverStartTime: null,
      hoverStayTime: null,
      ariaLabel: '',
    };
  }

  const candidate = raw as ActionSheetCancelButtonMiniProps;

  return {
    buttonId: typeof candidate.buttonId === 'string' ? candidate.buttonId : '',
    color:
      candidate.color === undefined
        ? null
        : normalizeActionColor(candidate.color),
    tone:
      candidate.tone === undefined ? null : normalizeButtonTone(candidate.tone),
    variant:
      candidate.variant === undefined
        ? null
        : normalizeButtonVariant(candidate.variant),
    size: candidate.size === undefined ? null : normalizeSize(candidate.size),
    radius:
      candidate.radius === undefined
        ? null
        : normalizeButtonRadius(candidate.radius),
    isBlock:
      candidate.isBlock === undefined ? true : Boolean(candidate.isBlock),
    isDisabled: Boolean(candidate.isDisabled),
    isLoading: normalizeButtonLoading(candidate.isLoading),
    className:
      typeof candidate.className === 'string' ? candidate.className : '',
    style: typeof candidate.style === 'string' ? candidate.style : '',
    hoverClass:
      typeof candidate.hoverClass === 'string' ? candidate.hoverClass : '',
    hoverStopPropagation: Boolean(candidate.hoverStopPropagation),
    hoverStartTime:
      typeof candidate.hoverStartTime === 'number'
        ? candidate.hoverStartTime
        : null,
    hoverStayTime:
      typeof candidate.hoverStayTime === 'number'
        ? candidate.hoverStayTime
        : null,
    ariaLabel:
      typeof candidate.ariaLabel === 'string' ? candidate.ariaLabel : '',
  };
}

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
        color: normalizeActionColor(candidate.color),
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
    _innerOpen: false as boolean,
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
    $resolvedOpen(data: ActionSheetMiniData) {
      return resolveOpen(data);
    },
    $resolvedSize(data: ActionSheetMiniData) {
      return normalizeSize(data.size);
    },
    $resolvedRadius(data: ActionSheetMiniData) {
      return normalizeRadius(data.radius, normalizeSize(data.size));
    },
    $classNames(data: ActionSheetMiniData) {
      const resolvedSize = normalizeSize(data.size);
      const resolvedRadius = normalizeRadius(data.radius, resolvedSize);
      const slots = actionSheet({
        isOpen: resolveOpen(data),
        size: resolvedSize,
        radius: resolvedRadius,
        isInset: Boolean(data.isInset),
      });
      const custom = (data.classNames ?? {}) as Record<
        string,
        string | undefined
      >;

      return {
        base: slots.base({ class: custom.base }),
        overlay: slots.overlay({ class: custom.overlay }),
        panel: slots.panel({ class: custom.panel }),
        content: slots.content({ class: custom.content }),
        header: slots.header({ class: custom.header }),
        title: slots.title({ class: custom.title }),
        description: slots.description({ class: custom.description }),
        list: slots.list({ class: custom.list }),
        actionGroup: slots.actionGroup({ class: custom.actionGroup }),
        actionDivider: slots.actionDivider({ class: custom.actionDivider }),
        action: slots.action({ class: custom.action }),
        actionLast: slots.actionLast({ class: custom.actionLast }),
        actionContent: slots.actionContent({ class: custom.actionContent }),
        actionLabel: slots.actionLabel({ class: custom.actionLabel }),
        actionDescription: slots.actionDescription({
          class: custom.actionDescription,
        }),
        footer: slots.footer({ class: custom.footer }),
        cancelGroup: slots.cancelGroup({ class: custom.cancelGroup }),
        cancel: slots.cancel({ class: custom.cancel }),
      };
    },
    $modalClassNames(data: ActionSheetMiniData) {
      const resolvedSize = normalizeSize(data.size);
      const resolvedRadius = normalizeRadius(data.radius, resolvedSize);
      const slots = actionSheet({
        isOpen: resolveOpen(data),
        size: resolvedSize,
        radius: resolvedRadius,
        isInset: Boolean(data.isInset),
      });
      const custom = (data.classNames ?? {}) as Record<
        string,
        string | undefined
      >;

      return {
        base: slots.base({ class: custom.base }),
        backdrop: slots.overlay({ class: custom.overlay }),
        content: slots.panel({ class: custom.panel }),
      };
    },
    $cancelText(data: ActionSheetMiniData) {
      if (data.cancelText) {
        return data.cancelText;
      }

      return ACTION_SHEET_CANCEL_TEXT[normalizeLocale(data.locale)];
    },
    $cancelButtonProps(data: ActionSheetMiniData) {
      return toCancelButtonProps(data.cancelButtonProps);
    },
    $renderActions(data: ActionSheetMiniData) {
      const actions = toItemArray(data.actions);
      return actions.map((item, index) => ({
        ...item,
        variant: 'text',
        actionClass: actionSheetAction({
          color: item.color ?? DEFAULT_ACTION_COLOR,
        }),
        isLast: index === actions.length - 1,
        index,
        key: `${typeof item.value}:${String(item.value)}`,
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

export { actionSheet } from '@srcube-ui/styles/components/action-sheet/style';
export type {
  ActionSheetCancelButtonMiniProps,
  ActionSheetMiniItem,
  ActionSheetMiniProps,
  ActionSheetMiniValue,
} from './props';
export { actionSheetMiniProps } from './props';
