import {
  attachSampleTone,
  detachSampleTone,
} from "../../../../shared/sample-theme-page";
import type { SampleTone } from "../../../../shared/sample-theme";

type DemoTabValue = string;

const tabsColorGroups = [
  [
    { label: "default", value: "default" },
    { label: "primary", value: "primary" },
    { label: "success", value: "success" },
  ],
  [
    { label: "secondary", value: "secondary" },
    { label: "warning", value: "warning" },
    { label: "danger", value: "danger" },
  ],
] as const;

type TabsColor = (typeof tabsColorGroups)[number][number]["value"];
type TabsVariant = "default" | "outline" | "twotone" | "underline";
type TabsPlacement = "top" | "start" | "end" | "bottom";
Page({
  data: {
    tone: "default" as SampleTone,
    surfaceClassName: "rounded-2xl bg-white p-4 shadow-sm",
    titleClassName: "text-sm font-semibold text-slate-900",
    descriptionClassName: "mt-1 text-xs text-slate-500",
    panelClassName: "rounded-2xl border border-slate-200 bg-white p-4",
    verticalPanelClassName:
      "h-full rounded-2xl border border-slate-200 bg-white p-4 text-sm",
    externalPanelClassName:
      "mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600",
    metaTextClassName: "mt-2 text-xs text-slate-500",

    basicValue: "tab-1" as DemoTabValue,
    basicTabs: [
      { value: "tab-1", label: "Tab 1" },
      { value: "tab-2", label: "Tab 2" },
      { value: "tab-3", label: "Tab 3" },
    ],

    verticalValue: "tab-a" as DemoTabValue,
    verticalTabs: [
      { value: "tab-a", label: "Tab A" },
      { value: "tab-b", label: "Tab B" },
      { value: "tab-c", label: "Tab C", isDisabled: true },
    ],
    placementValue: "start" as TabsPlacement,

    activeColor: "default" as TabsColor,
    activeVariant: "default" as TabsVariant,
    colorValue: "tab-1" as DemoTabValue,
    colorGroups: tabsColorGroups,
    colorTabs: [
      { value: "tab-1", label: "Tab 1" },
      { value: "tab-2", label: "Tab 2" },
      { value: "tab-3", label: "Tab 3" },
    ],

    customValue: "tab-1" as DemoTabValue,
    customPanelTabs: [
      { value: "tab-1", label: "Tab 1" },
      { value: "tab-2", label: "Tab 2" },
      { value: "tab-3", label: "Tab 3" },
    ],

    longValue: "long-1" as DemoTabValue,
    longTabs: Array.from({ length: 36 }, (_, index) => ({
      value: `long-${index + 1}`,
      label: `Tab ${index + 1}`,
    })),
  },

  _unsubscribeTone: null as null | (() => void),

  applyTone(tone: SampleTone) {
    this.setData({
      tone,
      surfaceClassName:
        tone === "dark"
          ? "rounded-2xl border border-zinc-800 bg-black p-4 shadow-sm shadow-black/30"
          : "rounded-2xl bg-white p-4 shadow-sm",
      titleClassName:
        tone === "dark"
          ? "text-sm font-semibold text-zinc-50"
          : "text-sm font-semibold text-slate-900",
      descriptionClassName:
        tone === "dark"
          ? "mt-1 text-xs text-zinc-400"
          : "mt-1 text-xs text-slate-500",
      panelClassName:
        tone === "dark"
          ? "rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-100"
          : "rounded-2xl border border-slate-200 bg-white p-4",
      verticalPanelClassName:
        tone === "dark"
          ? "h-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-100"
          : "h-full rounded-2xl border border-slate-200 bg-white p-4 text-sm",
      externalPanelClassName:
        tone === "dark"
          ? "mt-3 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-200"
          : "mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600",
      metaTextClassName:
        tone === "dark"
          ? "mt-2 text-xs text-zinc-400"
          : "mt-2 text-xs text-slate-500",
    });
  },

  onLoad() {
    attachSampleTone(this);
  },

  onUnload() {
    detachSampleTone(this);
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
