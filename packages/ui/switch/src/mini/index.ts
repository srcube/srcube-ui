import { UIComponent } from '@srcube-ui/runtime/mini';
import { switchStyle } from '../style';
import { switchMiniProps } from './props';

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    switchMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _autoLoading: false,
    _innerSelected: false,
  },

  lifetimes: {
    attached() {
      this.setData({ _innerSelected: this.data.defaultSelected });
    },
  },

  computed: {
    $isSelected(data) {
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
      return (data.isDisabled ?? false) || loading;
    },
    $classNames(data) {
      const selected = data.isSelected ?? data._innerSelected;
      const loading =
        data.isLoading === 'auto' ? data._autoLoading : data.isLoading;
      const disabled = (data.isDisabled ?? false) || loading;
      const readOnly = data.isReadOnly ?? false;
      const resolvedSize = data.size ?? 'md';
      const resolvedColor = data.color ?? 'default';
      const className = data.className ?? '';
      const custom = (data.classNames ?? {}) as Record<string, string>;

      const slots = switchStyle({
        color: resolvedColor,
        size: resolvedSize,
        isSelected: selected,
        isDisabled: disabled,
        isLoading: loading,
        isReadOnly: readOnly,
      });

      return {
        base: slots.base({ class: [custom.base, className] }),
        track: slots.track({ class: custom.track }),
        thumb: slots.thumb({ class: custom.thumb }),
        _iThumb: slots._iThumb(),
        _iLoading: slots._iLoading(),
        content: slots.content({ class: custom.content }),
        nSwitch: slots.nSwitch({ class: custom.nSwitch }),
      };
    },
  },

  methods: {
    async handleTap(e: WechatMiniprogram.TouchEvent) {
      const loading =
        this.data.isLoading === 'auto'
          ? this.data._autoLoading
          : this.data.isLoading;
      const disabled = (this.data.isDisabled ?? false) || loading;
      const readOnly = this.data.isReadOnly ?? false;

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
            console.error('Switch async error:', error);
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
      const currentSelected = this.data.isSelected ?? this.data._innerSelected;
      const nextSelected = !currentSelected;

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

export { switchStyle } from '../style';
export type { SwitchMiniProps } from './props';
export { switchMiniProps } from './props';
