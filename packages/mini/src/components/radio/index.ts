import { radio } from '@srcube-ui/styles/components/radio/style';
import { UIComponent } from '../../shared/ui-component';
import { radioMiniProps } from './props';

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  relations: {
    './radio-group/index': {
      type: 'ancestor',
    },
  },

  properties:
    radioMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _autoLoading: false,
    _innerSelected: false,
    groupValue: null,
    groupColor: null,
    groupSize: null,
    groupIsDisabled: null,
    groupIsReadOnly: null,
  },

  lifetimes: {
    attached() {
      this.setData({ _innerSelected: this.data.defaultSelected });
    },
  },

  computed: {
    $isSelected(data) {
      if (data.groupValue !== null && data.groupValue !== undefined) {
        return data.groupValue === data.value;
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
      const isInGroup =
        data.groupValue !== null && data.groupValue !== undefined;
      const selected = isInGroup
        ? data.groupValue === data.value
        : (data.isSelected ?? data._innerSelected);
      const loading =
        data.isLoading === 'auto' ? data._autoLoading : data.isLoading;
      const disabled =
        (data.isDisabled ?? data.groupIsDisabled ?? false) || loading;
      const readOnly = data.isReadOnly ?? data.groupIsReadOnly ?? false;
      const resolvedSize = data.size ?? data.groupSize ?? 'md';
      const resolvedColor = data.color ?? data.groupColor ?? 'default';
      const className = data.className ?? '';
      const custom = (data.classNames ?? {}) as Record<string, string>;

      const slots = radio({
        color: resolvedColor,
        size: resolvedSize,
        isSelected: selected,
        isDisabled: disabled,
        isLoading: loading,
        isReadOnly: readOnly,
      });

      return {
        base: slots.base({ class: [custom.base, className] }),
        radio: slots.radio({ class: custom.radio }),
        _iLoading: slots._iLoading(),
        content: slots.content({ class: custom.content }),
        iconWrapper: slots.iconWrapper({ class: custom.iconWrapper }),
        iDefault: slots.iDefault({ class: custom.iDefault }),
        nRadio: slots.nRadio({ class: custom.nRadio }),
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
            console.error('Radio async error:', error);
            this.setData({ _autoLoading: false });
            return;
          } finally {
            this.setData({ _autoLoading: false });
          }
        }

        this._select();
        return;
      }

      this.triggerEvent('tap', e);
      this._select();
    },

    _select() {
      const isInGroup =
        this.data.groupValue !== null && this.data.groupValue !== undefined;
      const currentSelected = isInGroup
        ? this.data.groupValue === this.data.value
        : (this.data.isSelected ?? this.data._innerSelected);

      if (isInGroup) {
        const [group] = this.getRelationNodes('./radio-group/index') as Array<{
          onChildSelect?: (value: string) => void;
        }>;
        group?.onChildSelect?.(this.data.value);
        return;
      }

      if (currentSelected) return;

      if (this.data.isSelected === null || this.data.isSelected === undefined) {
        this.setData({ _innerSelected: true });
      }

      this.triggerEvent('change', {
        value: this.data.value,
        isSelected: true,
      });
    },
  },
});

export { radio } from '@srcube-ui/styles/components/radio/style';
export type { RadioMiniProps } from './props';
export { radioMiniProps } from './props';
