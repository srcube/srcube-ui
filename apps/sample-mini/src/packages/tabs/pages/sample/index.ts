type DemoTabValue =
  | 'tab-1'
  | 'tab-2'
  | 'tab-3'
  | 'tab-a'
  | 'tab-b'
  | 'tab-c';

const tabsColorGroups = [
  [
    { label: 'default', value: 'default' },
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
  ],
  [
    { label: 'secondary', value: 'secondary' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' },
  ],
] as const;

type TabsColor = (typeof tabsColorGroups)[number][number]['value'];

Page({
  data: {
    basicValue: 'tab-1' as DemoTabValue,
    basicTabs: [
      { value: 'tab-1', label: 'Tab 1' },
      { value: 'tab-2', label: 'Tab 2' },
      { value: 'tab-3', label: 'Tab 3' },
    ],

    verticalValue: 'tab-a' as DemoTabValue,
    verticalTabs: [
      { value: 'tab-a', label: 'Tab A' },
      { value: 'tab-b', label: 'Tab B' },
      { value: 'tab-c', label: 'Tab C', isDisabled: true },
    ],

    activeColor: 'default' as TabsColor,
    colorValue: 'tab-1' as DemoTabValue,
    colorGroups: tabsColorGroups,
    colorTabs: [
      { value: 'tab-1', label: 'Tab 1' },
      { value: 'tab-2', label: 'Tab 2' },
      { value: 'tab-3', label: 'Tab 3' },
    ],

    customValue: 'tab-1' as DemoTabValue,
    customPanelTabs: [
      { value: 'tab-1', label: 'Tab 1' },
      { value: 'tab-2', label: 'Tab 2' },
      { value: 'tab-3', label: 'Tab 3' },
    ],
  },

  handleBasicChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    const value = e.detail?.value as DemoTabValue | undefined;
    if (!value) {
      return;
    }

    this.setData({
      basicValue: value,
    });
  },

  handleVerticalChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    const value = e.detail?.value as DemoTabValue | undefined;
    if (!value) {
      return;
    }

    this.setData({
      verticalValue: value,
    });
  },

  handleColorChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    const value = e.detail?.value as DemoTabValue | undefined;
    if (!value) {
      return;
    }

    this.setData({
      colorValue: value,
    });
  },

  handleColorTap(
    e: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          color?: TabsColor;
        };
      };
    },
  ) {
    const color = e.currentTarget?.dataset?.color;
    if (!color) {
      return;
    }

    this.setData({
      activeColor: color,
    });
  },

  handleCustomChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    const value = e.detail?.value as DemoTabValue | undefined;
    if (!value) {
      return;
    }

    this.setData({
      customValue: value,
    });
  },
});
