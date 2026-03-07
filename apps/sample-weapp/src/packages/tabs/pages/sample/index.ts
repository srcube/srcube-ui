type DemoTabValue = string;

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
type TabsVariant = 'default' | 'outline' | 'twotone' | 'flat' | 'underline';
type TabsPlacement = 'top' | 'start' | 'end' | 'bottom';

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
    placementValue: 'start' as TabsPlacement,

    activeColor: 'default' as TabsColor,
    activeVariant: 'default' as TabsVariant,
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

    longValue: 'long-1' as DemoTabValue,
    longTabs: Array.from({ length: 36 }, (_, index) => ({
      value: `long-${index + 1}`,
      label: `Tab ${index + 1}`,
    })),
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

  handleVariantTap(
    e: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          variant?: TabsVariant;
        };
      };
    },
  ) {
    const variant = e.currentTarget?.dataset?.variant;
    if (!variant) {
      return;
    }

    this.setData({
      activeVariant: variant,
    });
  },

  handlePlacementTap(
    e: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          placement?: TabsPlacement;
        };
      };
    },
  ) {
    const placement = e.currentTarget?.dataset?.placement;
    if (!placement) {
      return;
    }

    this.setData({
      placementValue: placement,
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

  handleLongChange(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
    const value = e.detail?.value as DemoTabValue | undefined;
    if (!value) {
      return;
    }

    this.setData({
      longValue: value,
    });
  },
});
