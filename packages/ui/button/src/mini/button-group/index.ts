import { UIComponent } from '@srcube-ui/mini';
import { buttonGroup } from '../../style';

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
    color: { type: null, value: 'primary' },
    variant: { type: null, value: 'solid' },
    size: { type: null, value: 'md' },
    radius: { type: null, value: 'md' },
    isBlock: { type: Boolean, value: false },
    isDisabled: { type: Boolean, value: false },
    className: { type: String, value: '' },
    style: { type: String, value: '' },
  },

  computed: {
    $className(data) {
      const { isBlock, className } = data;
      return buttonGroup({ isBlock, className });
    },
  },

  observers: {
    'color, variant, size, radius, isBlock, isDisabled': function () {
      this._updateChildren();
    },
  },

  methods: {
    _updateChildren() {
      const children = this.getRelationNodes('../index');
      if (!children || children.length === 0) return;

      children.forEach((child, index) => {
        const isFirst = index === 0;
        const isLast = index === children.length - 1;

        let groupPosition = 'none';

        if (children.length > 1) {
          if (isFirst) {
            groupPosition = 'first';
          } else if (isLast) {
            groupPosition = 'last';
          } else {
            groupPosition = 'middle';
          }
        }

        const { color, variant, size, radius, isDisabled, isBlock } = this.data;

        const childData = child.data as Record<string, unknown>;
        child.setData({
          isInGroup: true,
          groupPosition,
          groupColor: color,
          groupVariant: variant,
          groupSize: size,
          groupRadius: radius,
          groupIsDisabled: isDisabled,
          groupIsBlock: isBlock,
          className: childData.className || '',
        });
      });
    },
  },
});
