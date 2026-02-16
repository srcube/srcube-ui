import { UIComponent } from '@srcube-ui/runtime/mini';
import { checkbox } from '../style';
import { checkboxMiniProps } from './props';

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  relations: {
    './checkbox-group/index': {
      type: 'ancestor',
    },
  },

  properties:
    checkboxMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _autoLoading: false,
    _innerSelected: false,
    groupValue: null,
    groupColor: null,
    groupSize: null,
    groupRadius: null,
    groupIsDisabled: null,
    groupIsReadOnly: null,
    groupIsLineThrough: null,
  },

  lifetimes: {
    attached() {
      this.setData({ _innerSelected: this.data.defaultSelected });
    },
  },

  computed: {
    $isSelected(data) {
      if (Array.isArray(data.groupValue)) {
        return data.groupValue.includes(data.value);
      }
      if (data.isSelected !== null && data.isSelected !== undefined) {
        return data.isSelected;
      }
      return data._innerSelected;
    },
    $isLoading(data) {
      return data.isLoading === 'auto' ? data._autoLoading : data.isLoading;
    },
    $isDisabled(data) {
      const loading =
        data.isLoading === 'auto' ? data._autoLoading : data.isLoading;
      return (data.isDisabled ?? data.groupIsDisabled ?? false) || loading;
    },
    $classNames(data) {
      const isInGroup = Array.isArray(data.groupValue);
      const selected = isInGroup
        ? data.groupValue.includes(data.value)
        : (data.isSelected ?? data._innerSelected);
      const loading =
        data.isLoading === 'auto' ? data._autoLoading : data.isLoading;
      const disabled =
        (data.isDisabled ?? data.groupIsDisabled ?? false) || loading;
      const readOnly = data.isReadOnly ?? data.groupIsReadOnly ?? false;
      const resolvedSize = data.size ?? data.groupSize ?? 'md';
      const resolvedRadius = data.radius ?? data.groupRadius ?? 'md';
      const resolvedColor = data.color ?? data.groupColor ?? 'default';
      const resolvedLineThrough =
        data.isLineThrough ?? data.groupIsLineThrough ?? false;
      const className = data.className ?? '';
      const custom = (data.classNames ?? {}) as Record<string, string>;

      const slots = checkbox({
        color: resolvedColor,
        size: resolvedSize,
        radius: resolvedRadius,
        isSelected: selected,
        isIndeterminate: data.isIndeterminate,
        isDisabled: disabled,
        isLoading: loading,
        isReadOnly: readOnly,
        isLineThrough: resolvedLineThrough,
      });

      return {
        base: slots.base({ class: [custom.base, className] }),
        checkbox: slots.checkbox({ class: custom.checkbox }),
        spinner: slots.spinner({ class: custom.spinner }),
        content: slots.content({ class: custom.content }),
        iconWrapper: slots.iconWrapper({ class: custom.iconWrapper }),
        iDefault: slots.iDefault({ class: custom.iDefault }),
        iIndeterminate: slots.iIndeterminate({ class: custom.iIndeterminate }),
        nCheckbox: slots.nCheckbox({ class: custom.nCheckbox }),
      };
    },
  },

  methods: {
    async handleTap(e: WechatMiniprogram.TouchEvent) {
      const loading =
        this.data.isLoading === 'auto'
          ? this.data._autoLoading
          : this.data.isLoading;
      const disabled =
        (this.data.isDisabled ?? this.data.groupIsDisabled ?? false) || loading;
      const readOnly =
        this.data.isReadOnly ?? this.data.groupIsReadOnly ?? false;

      if (disabled || readOnly) return;

      if (this.data.isLoading === 'auto') {
        let promiseToWait: Promise<unknown> | undefined;

        const detail = {
          ...e.detail,
          source: e,
          wait: (
            promiseOrFactory: Promise<unknown> | (() => Promise<unknown>),
          ) => {
            const resolvedPromise =
              typeof promiseOrFactory === 'function'
                ? promiseOrFactory()
                : promiseOrFactory;

            if (resolvedPromise && typeof resolvedPromise.then === 'function') {
              promiseToWait = resolvedPromise;
            }
          },
        };

        this.triggerEvent('tap', detail);

        if (promiseToWait) {
          this.setData({ _autoLoading: true });
          try {
            await promiseToWait;
          } catch (error) {
            console.error('Checkbox async error:', error);
            this.setData({ _autoLoading: false });
            return;
          } finally {
            this.setData({ _autoLoading: false });
          }
        }

        this._toggle();
        return;
      }

      this.triggerEvent('tap', e);
      this._toggle();
    },

    _toggle() {
      const isInGroup = Array.isArray(this.data.groupValue);
      const currentSelected = isInGroup
        ? this.data.groupValue.includes(this.data.value)
        : (this.data.isSelected ?? this.data._innerSelected);
      const nextSelected = !currentSelected;

      if (isInGroup) {
        const [group] = this.getRelationNodes(
          './checkbox-group/index',
        ) as Array<{
          onChildToggle?: (value: string, nextSelected: boolean) => void;
        }>;
        group?.onChildToggle?.(this.data.value, nextSelected);
        return;
      }

      if (this.data.isSelected === null || this.data.isSelected === undefined) {
        this.setData({ _innerSelected: nextSelected });
      }

      this.triggerEvent('change', {
        value: this.data.value,
        isSelected: nextSelected,
      });
    },
  },
});

export { checkbox } from '../style';
export type { CheckboxMiniProps } from './props';
export { checkboxMiniProps } from './props';
