import {
  attachSampleTone,
  detachSampleTone,
} from "../../../../shared/sample-theme-page";
import type { SampleTone } from "../../../../shared/sample-theme";

Page({
  data: {
    isOpen: false,
    currentStep: 0,
    tone: "default" as SampleTone,
    lastEvent: "idle",
    steps: [
      {
        selector: "#tour-target-search",
        title: "Search",
        description: "Use this input to quickly locate records.",
        skipText: "跳过",
        placement: "bottom",
        radius: 16,
      },
      {
        selector: "#tour-target-filter",
        title: "Filter",
        description: "Switch status and tags with one tap.",
        placement: "bottom",
        radius: 16,
      },
      {
        selector: "#tour-target-list",
        title: "List",
        description: "Long content area supports auto scroll positioning.",
        placement: "top",
        radius: 16,
      },
      {
        selector: "#tour-target-submit",
        title: "Submit",
        description: "Final action button near page bottom.",
        placement: "top",
        radius: 16,
      },
    ],
  },

  _unsubscribeTone: null as null | (() => void),

  applyTone(tone: SampleTone) {
    this.setData({
      tone,
    });
  },

  onLoad() {
    attachSampleTone(this);
  },

  onUnload() {
    detachSampleTone(this);
  },

  handleStartTap() {
    this.setData({
      isOpen: true,
      currentStep: 0,
      lastEvent: "start",
    });
  },

  handleStartFromThirdTap() {
    this.setData({
      isOpen: true,
      currentStep: 2,
      lastEvent: "start-step-3",
    });
  },

  handleOpenChange(
    event: WechatMiniprogram.CustomEvent<{
      isOpen?: boolean;
      reason?: string;
    }>,
  ) {
    this.setData({
      isOpen: Boolean(event.detail?.isOpen),
      lastEvent: event.detail?.reason || "openchange",
    });
  },

  handleStepChange(
    event: WechatMiniprogram.CustomEvent<{
      stepIndex?: number;
      reason?: string;
    }>,
  ) {
    this.setData({
      currentStep: Number(event.detail?.stepIndex ?? 0),
      lastEvent: event.detail?.reason || "stepchange",
    });
  },

  handleSkip() {
    this.setData({
      lastEvent: "skip",
    });
  },

  handleFinish() {
    this.setData({
      lastEvent: "finish",
      isOpen: false,
    });
  },
});
