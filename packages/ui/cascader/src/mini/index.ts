import { UIComponent } from '@srcube-ui/runtime/mini';
import { cascader } from '../style';
import {
  type CascaderMiniOption,
  type CascaderMiniOptionId,
  type CascaderMiniProps,
  type CascaderMiniValue,
  cascaderMiniProps,
} from './props';

type CascaderMiniColumn = {
  id: number;
  items: Array<{
    id: CascaderMiniOptionId;
    label: string;
    isDisabled?: boolean;
  }>;
};

type CascaderMiniState = {
  _innerOpen: boolean;
  _innerCommittedValue: CascaderMiniValue;
  _draftValue: CascaderMiniValue;
};

type CascaderMiniData = CascaderMiniProps & CascaderMiniState;

function isSameOptionId(
  left: CascaderMiniOptionId | null | undefined,
  right: CascaderMiniOptionId | null | undefined,
) {
  if (left === right) {
    return true;
  }

  if (
    left === null ||
    left === undefined ||
    right === null ||
    right === undefined
  ) {
    return false;
  }

  if (
    (typeof left === 'number' && typeof right === 'string') ||
    (typeof left === 'string' && typeof right === 'number')
  ) {
    const leftNumber = Number(left);
    const rightNumber = Number(right);
    return (
      Number.isFinite(leftNumber) &&
      Number.isFinite(rightNumber) &&
      leftNumber === rightNumber
    );
  }

  return false;
}

function isControlledValue(value: unknown) {
  return value !== null && value !== undefined;
}

function isControlledOpen(value: unknown) {
  return value !== null && value !== undefined;
}

function resolveOpen(data: Pick<CascaderMiniData, 'isOpen' | '_innerOpen'>) {
  return isControlledOpen(data.isOpen) ? Boolean(data.isOpen) : data._innerOpen;
}

function normalizeOptions(raw: unknown): CascaderMiniOption[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .filter((option): option is CascaderMiniOption => {
      if (!option || typeof option !== 'object') {
        return false;
      }

      const id = (option as CascaderMiniOption).id;
      return typeof id === 'string' || typeof id === 'number';
    })
    .map((option) => ({
      id: option.id,
      label: String(option.label ?? ''),
      isDisabled: option.isDisabled === true,
      children: normalizeOptions(option.children),
    }));
}

function getEnabledOption(options: CascaderMiniOption[]) {
  return options.find((option) => !option.isDisabled) ?? options[0] ?? null;
}

function normalizePath(
  options: CascaderMiniOption[],
  input?: CascaderMiniValue,
) {
  const normalized: CascaderMiniValue = [];
  let levelOptions = options;
  let levelIndex = 0;

  while (levelOptions.length > 0) {
    const desired = Array.isArray(input) ? input[levelIndex] : undefined;
    const matched = levelOptions.find(
      (option) => !option.isDisabled && isSameOptionId(option.id, desired),
    );

    const selected = matched ?? getEnabledOption(levelOptions);
    if (!selected) {
      break;
    }

    normalized.push(selected.id);
    levelOptions = selected.children ?? [];
    levelIndex += 1;
  }

  return normalized;
}

function buildColumns(options: CascaderMiniOption[], path: CascaderMiniValue) {
  const columns: CascaderMiniColumn[] = [];
  let levelOptions = options;
  let levelIndex = 0;

  while (levelOptions.length > 0) {
    columns.push({
      id: levelIndex,
      items: levelOptions.map((option) => ({
        id: option.id,
        label: option.label,
        isDisabled: option.isDisabled,
      })),
    });

    const selected = levelOptions.find((option) =>
      isSameOptionId(option.id, path[levelIndex]),
    );

    const fallback = selected ?? getEnabledOption(levelOptions);
    if (!fallback) {
      break;
    }

    levelOptions = fallback.children ?? [];
    levelIndex += 1;
  }

  return columns;
}

function resolveSelectedOptions(
  options: CascaderMiniOption[],
  value: CascaderMiniValue,
) {
  const selected: CascaderMiniOption[] = [];
  let levelOptions = options;

  for (const itemId of value) {
    if (levelOptions.length === 0) {
      break;
    }

    const option = levelOptions.find((candidate) =>
      isSameOptionId(candidate.id, itemId),
    );
    if (!option) {
      break;
    }

    selected.push(option);
    levelOptions = option.children ?? [];
  }

  return selected;
}

function toOutputValue(value: CascaderMiniValue): CascaderMiniValue {
  return value.map((item) => (item === undefined ? null : item));
}

function resolveChangedIndex(
  previous: CascaderMiniValue,
  next: CascaderMiniValue,
  columnIndex: unknown,
) {
  if (typeof columnIndex === 'number' && Number.isFinite(columnIndex)) {
    return Math.max(0, columnIndex);
  }

  const total = Math.max(previous.length, next.length);
  for (let index = 0; index < total; index += 1) {
    if (!isSameOptionId(previous[index], next[index])) {
      return index;
    }
  }

  return undefined;
}

function resolveCommittedValue(
  data: CascaderMiniData,
  options: CascaderMiniOption[],
) {
  const source = isControlledValue(data.value)
    ? (data.value as CascaderMiniValue)
    : data._innerCommittedValue.length > 0
      ? data._innerCommittedValue
      : data.defaultValue;

  return normalizePath(options, source);
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    cascaderMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerOpen: false,
    _innerCommittedValue: [] as CascaderMiniValue,
    _draftValue: [] as CascaderMiniValue,
  } satisfies CascaderMiniState,

  observers: {
    value() {
      this.syncValuesFromProps();
    },
    options() {
      this.syncValuesFromProps();
    },
    defaultValue() {
      if (isControlledValue(this.data.value)) {
        return;
      }

      this.syncValuesFromProps();
    },
    isOpen(nextOpen: CascaderMiniProps['isOpen']) {
      if (!isControlledOpen(nextOpen)) {
        return;
      }

      const options = normalizeOptions(this.data.options);
      const committed = resolveCommittedValue(
        this.data as CascaderMiniData,
        options,
      );

      this.setData({
        _draftValue: committed,
      } satisfies Partial<CascaderMiniState>);
    },
  },

  lifetimes: {
    attached() {
      const options = normalizeOptions(this.data.options);
      const committed = normalizePath(
        options,
        isControlledValue(this.data.value)
          ? (this.data.value as CascaderMiniValue)
          : this.data.defaultValue,
      );

      this.setData({
        _innerOpen: isControlledOpen(this.data.isOpen)
          ? Boolean(this.data.isOpen)
          : Boolean(this.data.defaultOpen),
        _innerCommittedValue: committed,
        _draftValue: committed,
      } satisfies Partial<CascaderMiniState>);
    },
  },

  computed: {
    $resolvedOpen(data: CascaderMiniData) {
      return resolveOpen(data);
    },
    $resolvedValue(data: CascaderMiniData) {
      const options = normalizeOptions(data.options);
      const committed = resolveCommittedValue(data, options);
      const source = resolveOpen(data) ? data._draftValue : committed;
      return normalizePath(options, source);
    },
    $resolvedColumns(data: CascaderMiniData) {
      const options = normalizeOptions(data.options);
      const committed = resolveCommittedValue(data, options);
      const source = resolveOpen(data) ? data._draftValue : committed;
      const value = normalizePath(options, source);
      return buildColumns(options, value);
    },
    $classNames(data: CascaderMiniData) {
      const slots = cascader();
      const custom = (data.classNames ?? {}) as Record<
        string,
        string | undefined
      >;

      return {
        base: slots.base({ class: custom.base }),
        $picker: slots.$picker({ class: custom.$picker }),
        picker: slots.picker({ class: custom.picker }),
      };
    },
  },

  methods: {
    syncValuesFromProps() {
      const options = normalizeOptions(this.data.options);
      const committed = resolveCommittedValue(
        this.data as CascaderMiniData,
        options,
      );

      this.setData({
        _innerCommittedValue: isControlledValue(this.data.value)
          ? this.data._innerCommittedValue
          : committed,
        _draftValue: resolveOpen(this.data as CascaderMiniData)
          ? normalizePath(options, this.data._draftValue)
          : committed,
      } satisfies Partial<CascaderMiniState>);
    },

    handlePickerTap(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent('tap', e.detail ?? {});
    },

    handlePickerOpenChange(
      e: WechatMiniprogram.CustomEvent<{ isOpen?: boolean | null }>,
    ) {
      const isOpen = Boolean(e.detail?.isOpen);
      const options = normalizeOptions(this.data.options);
      const committed = resolveCommittedValue(
        this.data as CascaderMiniData,
        options,
      );

      this.setData(
        {
          _innerOpen: isControlledOpen(this.data.isOpen)
            ? this.data._innerOpen
            : isOpen,
          _draftValue: committed,
        } satisfies Partial<CascaderMiniState>,
        () => {
          this.triggerEvent('openchange', {
            isOpen,
          });
        },
      );
    },

    handlePickerCancel(e: WechatMiniprogram.CustomEvent) {
      const options = normalizeOptions(this.data.options);
      const committed = resolveCommittedValue(
        this.data as CascaderMiniData,
        options,
      );
      const selected = resolveSelectedOptions(options, committed);

      this.setData(
        {
          _draftValue: committed,
        } satisfies Partial<CascaderMiniState>,
        () => {
          this.triggerEvent('cancel', {
            ...(e.detail ?? {}),
            value: toOutputValue(committed),
            values: toOutputValue(committed),
            labels: selected.map((option) => option.label),
            options: selected,
          });
        },
      );
    },

    handlePickerDraftValueChange(
      e: WechatMiniprogram.CustomEvent<{
        value?: unknown;
        values?: unknown;
        columnIndex?: unknown;
      }>,
    ) {
      const options = normalizeOptions(this.data.options);
      const source = (e.detail?.values ?? e.detail?.value) as unknown;
      const candidate = Array.isArray(source)
        ? (source as CascaderMiniValue)
        : [];
      const changedIndex = resolveChangedIndex(
        this.data._draftValue,
        candidate,
        e.detail?.columnIndex,
      );
      const nextInput =
        changedIndex === undefined
          ? candidate
          : candidate.slice(0, changedIndex + 1);
      const normalized = normalizePath(options, nextInput);
      const selected = resolveSelectedOptions(options, normalized);

      this.setData(
        {
          _draftValue: normalized,
        } satisfies Partial<CascaderMiniState>,
        () => {
          this.triggerEvent('draftvaluechange', {
            value: toOutputValue(normalized),
            values: toOutputValue(normalized),
            labels: selected.map((option) => option.label),
            options: selected,
            columnIndex: changedIndex,
            optionId:
              changedIndex === undefined
                ? undefined
                : (normalized[changedIndex] ?? undefined),
          });
        },
      );
    },

    handlePickerValueChange(
      e: WechatMiniprogram.CustomEvent<{
        value?: unknown;
        values?: unknown;
      }>,
    ) {
      const options = normalizeOptions(this.data.options);
      const source = (e.detail?.values ?? e.detail?.value) as unknown;
      const candidate = Array.isArray(source)
        ? (source as CascaderMiniValue)
        : [];
      const normalized = normalizePath(options, candidate);
      const selected = resolveSelectedOptions(options, normalized);

      this.setData(
        {
          _innerCommittedValue: isControlledValue(this.data.value)
            ? this.data._innerCommittedValue
            : normalized,
          _draftValue: normalized,
        } satisfies Partial<CascaderMiniState>,
        () => {
          this.triggerEvent('valuechange', {
            value: toOutputValue(normalized),
            values: toOutputValue(normalized),
            labels: selected.map((option) => option.label),
            options: selected,
          });
        },
      );
    },
  },
});

export { cascader } from '../style';
export type {
  CascaderMiniOption,
  CascaderMiniOptionId,
  CascaderMiniProps,
  CascaderMiniValue,
} from './props';
export { cascaderMiniProps } from './props';
