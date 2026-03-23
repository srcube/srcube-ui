import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

type PickerSize = 'sm' | 'md' | 'lg';
type PickerDatetimeMode = 'datetime' | 'date' | 'time';

type PickerMultiValue = Array<string | number | null>;
type PickerSelectValue = Array<string | number>;
type DateRangeValue = {
  start: string | null;
  end: string | null;
};

function formatMultiValueText(value: PickerMultiValue) {
  const text = value
    .filter((item): item is string | number => item !== null && item !== undefined)
    .map((item) => String(item))
    .join(' / ');

  return text || 'none';
}

Page({
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

  data: {
    tone: 'default' as SampleTone,
    pickerSize: 'md' as PickerSize,
    datetimeMode: 'datetime' as PickerDatetimeMode,
    datetimeFormat: 'YYYY-MM-DD HH:mm:ss',
    singleItems: [
      { id: 'cq', label: '重庆' },
      { id: 'cd', label: '成都' },
      { id: 'sh', label: '上海' },
      { id: 'sz', label: '深圳' },
    ],
    singleValue: [] as PickerMultiValue,
    clearableValue: [] as PickerMultiValue,
    cascadeOptions: [
      {
        id: 'fruit',
        label: '水果',
        children: [
          {
            id: 'citrus',
            label: '柑橘类',
            children: [
              { id: 'orange', label: '橙子' },
              { id: 'grapefruit', label: '西柚' },
            ],
          },
          {
            id: 'berry',
            label: '莓果类',
            children: [
              { id: 'strawberry', label: '草莓' },
              { id: 'blueberry', label: '蓝莓' },
            ],
          },
        ],
      },
      {
        id: 'drink',
        label: '饮品',
        children: [
          {
            id: 'tea',
            label: '茶饮',
            children: [
              { id: 'green-tea', label: '绿茶' },
              { id: 'oolong-tea', label: '乌龙茶' },
            ],
          },
          {
            id: 'coffee',
            label: '咖啡',
            children: [
              { id: 'latte', label: '拿铁' },
              { id: 'americano', label: '美式' },
            ],
          },
        ],
      },
      {
        id: 'snack',
        label: '零食',
        children: [
          {
            id: 'chips',
            label: '薯片',
            children: [
              { id: 'potato-chips', label: '土豆片' },
              { id: 'tortilla-chips', label: '玉米片' },
            ],
          },
          {
            id: 'nuts',
            label: '坚果',
            children: [
              { id: 'almond', label: '杏仁' },
              { id: 'cashew', label: '腰果' },
            ],
          },
        ],
      },
    ],
    cascadeValue: [] as PickerMultiValue,
    cascadeValueText: 'none',
    selectItems: [
      { id: 'discover', label: '需求调研', isSticky: true },
      { id: 'design', label: '设计方案' },
      { id: 'develop', label: '组件开发' },
      { id: 'test', label: '联调测试' },
      { id: 'release', label: '上线发布' },
      { id: 'monitor', label: '监控告警' },
      { id: 'retrospective', label: '复盘总结' },
      { id: 'a11y', label: '无障碍巡检' },
      { id: 'i18n', label: '多语言校对' },
      { id: 'token', label: '设计令牌同步' },
      { id: 'perf', label: '性能优化' },
      { id: 'security', label: '安全审计' },
      { id: 'docs', label: '文档补全' },
      { id: 'qa', label: '灰度验收' },
      { id: 'oncall', label: '值班处理' },
      { id: 'ops', label: '运维观察', isDisabled: true },
      { id: 'support', label: '客户支持' },
      { id: 'feedback', label: '反馈闭环' },
      { id: 'archive', label: '归档沉淀' },
    ],
    selectValue: [] as PickerSelectValue,
    selectValueText: 'none',
    datetimeValue: '',
    datetimeRangeValue: {
      start: null,
      end: null,
    } as DateRangeValue,
    defaultSingleValue: ['cd'] as PickerMultiValue,
    defaultCascadeValue: ['fruit', 'citrus', 'orange'] as PickerMultiValue,
    defaultSelectValue: ['design', 'develop'] as PickerSelectValue,
    defaultDatetimeValue: '2026-02-13 09:30:00',
    defaultDatetimeRangeValue: {
      start: '2026-02-13 09:30:00',
      end: '2026-02-18 18:30:00',
    } as DateRangeValue,
  },

  handleDatetimeModeTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          mode?: PickerDatetimeMode;
        };
      };
    },
  ) {
    const nextMode = event.currentTarget?.dataset?.mode;
    if (!nextMode) {
      return;
    }

    let nextFormat = 'YYYY-MM-DD HH:mm:ss';
    if (nextMode === 'date') {
      nextFormat = 'YYYY/MM/DD';
    } else if (nextMode === 'time') {
      nextFormat = 'HH:mm';
    }

    this.setData({
      datetimeMode: nextMode,
      datetimeFormat: nextFormat,
    });
  },

  handleSizeTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          size?: PickerSize;
        };
      };
    },
  ) {
    const nextSize = event.currentTarget?.dataset?.size;
    if (!nextSize) {
      return;
    }

    this.setData({
      pickerSize: nextSize,
    });
  },

  handleSingleValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: PickerMultiValue;
    }>,
  ) {
    const nextValue = event.detail?.value;
    if (!Array.isArray(nextValue)) {
      return;
    }

    this.setData({
      singleValue: nextValue,
    });
  },

  handleCascadeValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: PickerMultiValue;
    }>,
  ) {
    const nextValue = event.detail?.value;
    if (!Array.isArray(nextValue)) {
      return;
    }

    this.setData({
      cascadeValue: nextValue,
      cascadeValueText: formatMultiValueText(nextValue),
    });
  },

  handleClearableValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: PickerMultiValue;
    }>,
  ) {
    const nextValue = event.detail?.value;
    if (!Array.isArray(nextValue)) {
      return;
    }

    this.setData({
      clearableValue: nextValue,
    });
  },

  handleSelectValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: PickerSelectValue;
    }>,
  ) {
    const nextValue = event.detail?.value;
    if (!Array.isArray(nextValue)) {
      return;
    }

    this.setData({
      selectValue: nextValue,
      selectValueText: nextValue.map((item) => String(item)).join(' / ') || 'none',
    });
  },

  handleDatetimeValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: string;
    }>,
  ) {
    this.setData({
      datetimeValue: event.detail?.value ?? '',
    });
  },

  handleDatetimeRangeValueChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: DateRangeValue;
    }>,
  ) {
    const nextValue = event.detail?.value;
    if (!nextValue) {
      return;
    }

    this.setData({
      datetimeRangeValue: {
        start: nextValue.start ?? null,
        end: nextValue.end ?? null,
      },
    });
  },
});
