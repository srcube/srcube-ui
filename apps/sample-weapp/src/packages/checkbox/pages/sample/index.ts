Page({
  data: {
    tone: "default" as "default" | "dark",
    pageClassName: "min-h-screen bg-slate-100 text-slate-900 pb-safe",
    navbarClassName: "sticky top-0 z-20 border-b border-slate-200",
    surfaceClassName: "rounded-2xl bg-white p-4 shadow-sm",
    titleClassName: "text-sm font-semibold text-slate-900",
    descriptionClassName: "mt-1 text-xs text-slate-500",
    colorValue: ["primary"],
    sizeValue: ["md"],
    radiusValue: ["md"],
    groupValue: ["left"],
    groupDefault: ["a"],
    customCheckClassNames: {
      iDefault: "icon-[ion--checkmark]",
    },
    customIndeterminateClassNames: {
      iIndeterminate: "icon-[ion--remove]",
    },
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
    radii: [
      { label: "None", value: "none" },
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
      { label: "Full", value: "full" },
    ],
  },

  setToneClasses(tone: "default" | "dark") {
    this.setData({
      tone,
      pageClassName:
        tone === "dark"
          ? "min-h-screen bg-zinc-950 text-zinc-50 pb-safe"
          : "min-h-screen bg-slate-100 text-slate-900 pb-safe",
      navbarClassName:
        tone === "dark"
          ? "sticky top-0 z-20 border-b border-zinc-800"
          : "sticky top-0 z-20 border-b border-slate-200",
      surfaceClassName:
        tone === "dark"
          ? "rounded-2xl bg-zinc-900 p-4 shadow-sm shadow-black/20"
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

  handleToneTap(
    e: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          tone?: "default" | "dark";
        };
      };
    }
  ) {
    const tone = e.currentTarget?.dataset?.tone;
    if (!tone) return;
    this.setToneClasses(tone);
  },

  handleColorChange(e: WechatMiniprogram.CustomEvent) {
    const { value } = e.detail || {};
    if (!Array.isArray(value)) return;
    this.setData({ colorValue: value });
  },
  handleSizeChange(e: WechatMiniprogram.CustomEvent) {
    const { value } = e.detail || {};
    if (!Array.isArray(value)) return;
    this.setData({ sizeValue: value });
  },
  handleRadiusChange(e: WechatMiniprogram.CustomEvent) {
    const { value } = e.detail || {};
    if (!Array.isArray(value)) return;
    this.setData({ radiusValue: value });
  },
  handleGroupChange(e: WechatMiniprogram.CustomEvent) {
    const { value } = e.detail || {};
    if (!Array.isArray(value)) return;
    this.setData({ groupValue: value });
  },
  handleAutoLoading(e: WechatMiniprogram.TouchEvent) {
    const wait = e?.detail?.wait;
    if (typeof wait !== "function") return;
    wait(new Promise((resolve) => setTimeout(resolve, 800)));
  },
});
