import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

type SelectboxColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';
type SelectboxSize = 'sm' | 'md' | 'lg';
type SelectionMode = 'single' | 'multiple';
type SelectboxValue = Array<string | number>;

function formatValue(value: SelectboxValue) {
  if (!Array.isArray(value) || value.length <= 0) {
    return 'none';
  }

  return value.map((item) => String(item)).join(' / ');
}

Page({
  data: {
    tone: 'default' as SampleTone,
    color: 'default' as SelectboxColor,
    size: 'md' as SelectboxSize,
    mode: 'multiple' as SelectionMode,
    selectIcon: true,
    items: [
      { id: 'planning', label: '需求规划', isSticky: true },
      { id: 'discover', label: '需求调研' },
      { id: 'design', label: '设计方案' },
      { id: 'develop', label: '组件开发' },
      { id: 'test', label: '联调测试' },
      { id: 'release', label: '上线发布' },
      { id: 'ops', label: '运维观察', isDisabled: true },
      { id: 'feedback', label: '反馈闭环' },
    ],
    value: ['design', 'develop'] as SelectboxValue,
    valueText: formatValue(['design', 'develop']),
    horizontalItems: [
      { id: 'phase', label: '阶段', isSticky: true },
      { id: 'phase-1', label: '第一阶段' },
      { id: 'phase-2', label: '第二阶段' },
      { id: 'phase-3', label: '第三阶段' },
      { id: 'phase-4', label: '第四阶段' },
    ],
    horizontalValue: ['phase-2'] as SelectboxValue,
    horizontalValueText: formatValue(['phase-2']),
  },

  _unsubscribeTone: null as null | (() => void),

  applyTone(tone: SampleTone) {
    this.setData({ tone });
  },

  onLoad() {
    attachSampleTone(this);
  },

  onUnload() {
    detachSampleTone(this);
  },

  handleSizeTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          size?: SelectboxSize;
        };
      };
    },
  ) {
    const nextSize = event.currentTarget?.dataset?.size;
    if (!nextSize) {
      return;
    }

    this.setData({
      size: nextSize,
    });
  },

  handleColorTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          color?: SelectboxColor;
        };
      };
    },
  ) {
    const nextColor = event.currentTarget?.dataset?.color;
    if (!nextColor) {
      return;
    }

    this.setData({
      color: nextColor,
    });
  },

  handleModeTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          mode?: SelectionMode;
        };
      };
    },
  ) {
    const nextMode = event.currentTarget?.dataset?.mode;
    if (!nextMode) {
      return;
    }

    this.setData({
      mode: nextMode,
    });
  },

  handleSelectIconTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          enabled?: string;
        };
      };
    },
  ) {
    const enabled = event.currentTarget?.dataset?.enabled;
    this.setData({
      selectIcon: enabled === 'true',
    });
  },

  handleValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: SelectboxValue;
    }>,
  ) {
    const nextValue = event.detail?.value;
    if (!Array.isArray(nextValue)) {
      return;
    }

    this.setData({
      value: nextValue,
      valueText: formatValue(nextValue),
    });
  },

  handleHorizontalValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: SelectboxValue;
    }>,
  ) {
    const nextValue = event.detail?.value;
    if (!Array.isArray(nextValue)) {
      return;
    }

    this.setData({
      horizontalValue: nextValue,
      horizontalValueText: formatValue(nextValue),
    });
  },
});
