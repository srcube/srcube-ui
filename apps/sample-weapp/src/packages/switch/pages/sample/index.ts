import {
  attachSampleTone,
  detachSampleTone,
} from "../../../../shared/sample-theme-page";
import type { SampleTone } from "../../../../shared/sample-theme";

Page({
  data: {
    tone: "default" as SampleTone,
    surfaceClassName: "rounded-2xl bg-white p-4 shadow-sm",
    titleClassName: "text-sm font-semibold text-slate-900",
    descriptionClassName: "mt-1 text-xs text-slate-500",
    colorValue: "primary",
    sizeValue: "md",
    isEnabled: true,
    colors: [
      { label: "Default", value: "default" },
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" },
      { label: "Success", value: "success" },
      { label: "Warning", value: "warning" },
      { label: "Danger", value: "danger" },
    ],
    sizes: [
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
    ],
  },

  _unsubscribeTone: null as null | (() => void),

  setToneClasses(tone: SampleTone) {
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
    });
  },

  applyTone(tone: SampleTone) {
    this.setToneClasses(tone);
  },

  onLoad() {
    attachSampleTone(this);
  },

  onUnload() {
    detachSampleTone(this);
  },

  handleColorChange(e: WechatMiniprogram.CustomEvent) {
    const { isSelected } = e.detail || {};
    const { value } = e.currentTarget.dataset;

    if (!isSelected || typeof value !== "string") return;
    this.setData({ colorValue: value });
  },
  handleColorTap(e: WechatMiniprogram.TouchEvent) {
    const value = e.currentTarget.dataset.value as string | undefined;
    if (!value) return;
    this.setData({ colorValue: value });
  },
  handleSizeChange(e: WechatMiniprogram.CustomEvent) {
    const { isSelected } = e.detail || {};
    const { value } = e.currentTarget.dataset;

    if (!isSelected || typeof value !== "string") return;
    this.setData({ sizeValue: value });
  },
  handleSizeTap(e: WechatMiniprogram.TouchEvent) {
    const value = e.currentTarget.dataset.value as string | undefined;
    if (!value) return;
    this.setData({ sizeValue: value });
  },
  handleEnabledChange(e: WechatMiniprogram.CustomEvent) {
    const { isSelected } = e.detail || {};
    this.setData({ isEnabled: Boolean(isSelected) });
  },
  handleAutoLoading(e: WechatMiniprogram.TouchEvent) {
    const wait = e?.detail?.wait;
    if (typeof wait !== "function") return;
    wait(new Promise((resolve) => setTimeout(resolve, 800)));
  },
});
