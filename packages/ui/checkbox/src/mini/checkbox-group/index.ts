import { UIComponent } from '@srcube-ui/runtime/mini';
import { checkboxGroup } from '../../style';

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'shared',
    virtualHost: true,
  },

  relations: {
    '../index': {
      type: 'descendant',
      linked() {
        this._updateChildren();
      },
      linkChanged() {
        this._updateChildren();
      },
      unlinked() {
        this._updateChildren();
      },
    },
  },

  properties: {
    value: { type: null, value: null },
    defaultValue: { type: Array, value: [] },
    orientation: { type: String, value: 'y' },
    isBlock: { type: Boolean, value: false },
    color: { type: null, value: null },
    size: { type: null, value: null },
    radius: { type: null, value: null },
    isDisabled: { type: null, value: null },
    isReadOnly: { type: null, value: null },
    isLineThrough: { type: null, value: null },
    className: { type: String, value: '' },
    style: { type: String, value: '' },
  } satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerValue: [] as string[],
  },

  lifetimes: {
    attached() {
      if (!Array.isArray(this.data.value)) {
        this.setData({ _innerValue: this.data.defaultValue });
      }
    },
  },

  computed: {
    $className(data) {
      return checkboxGroup({
        orientation: data.orientation,
        isBlock: data.isBlock,
        className: data.className ?? '',
      });
    },
  },

  observers: {
    'value,_innerValue,color,size,radius,isDisabled,isReadOnly,isLineThrough':
      function () {
        this._updateChildren();
      },
  },

  methods: {
    _getCurrentValue(): string[] {
      return Array.isArray(this.data.value)
        ? this.data.value
        : this.data._innerValue;
    },

    _updateChildren() {
      const children = this.getRelationNodes('../index');
      if (!children || children.length === 0) return;

      const currentValue = this._getCurrentValue();

      children.forEach((child) => {
        child.setData({
          groupValue: currentValue,
          groupColor: this.data.color,
          groupSize: this.data.size,
          groupRadius: this.data.radius,
          groupIsDisabled: this.data.isDisabled,
          groupIsReadOnly: this.data.isReadOnly,
          groupIsLineThrough: this.data.isLineThrough,
        });
      });
    },

    onChildToggle(value: string, nextSelected: boolean) {
      const currentValue = this._getCurrentValue();
      const exists = currentValue.includes(value);
      const nextValue = nextSelected
        ? exists
          ? currentValue
          : [...currentValue, value]
        : currentValue.filter((item) => item !== value);

      if (!Array.isArray(this.data.value)) {
        this.setData({ _innerValue: nextValue });
      }

      this.triggerEvent('change', { value: nextValue });
    },
  },
});
