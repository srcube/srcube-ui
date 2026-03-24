import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

type VibrationMethod = {
  id: string;
  title: string;
  description: string;
  supported: boolean;
};

function resolveButtonTone(tone: SampleTone) {
  return tone === 'dark' ? 'dark' : 'light';
}

function vibrateShort(type?: 'heavy' | 'medium' | 'light') {
  return new Promise<void>((resolve, reject) => {
    wx.vibrateShort({
      ...(type ? { type } : {}),
      success: () => resolve(),
      fail: reject,
    });
  });
}

function vibrateLong() {
  return new Promise<void>((resolve, reject) => {
    wx.vibrateLong({
      success: () => resolve(),
      fail: reject,
    });
  });
}

Page({
  data: {
    tone: 'default' as SampleTone,
    buttonTone: 'light' as 'light' | 'dark',
    methods: [
      {
        id: 'short-default',
        title: '短震动',
        description: 'wx.vibrateShort()',
        supported: true,
      },
      {
        id: 'short-light',
        title: '短震动 light',
        description: "wx.vibrateShort({ type: 'light' })",
        supported: true,
      },
      {
        id: 'short-medium',
        title: '短震动 medium',
        description: "wx.vibrateShort({ type: 'medium' })",
        supported: true,
      },
      {
        id: 'short-heavy',
        title: '短震动 heavy',
        description: "wx.vibrateShort({ type: 'heavy' })",
        supported: true,
      },
      {
        id: 'long',
        title: '长震动',
        description: 'wx.vibrateLong()',
        supported: true,
      },
    ] as VibrationMethod[],
    statusText: '点按钮开始测试',
    lastSuccessText: '-',
    lastErrorText: '-',
    isRunning: false,
  },

  applyTone(tone: SampleTone) {
    this.setData({
      tone,
      buttonTone: resolveButtonTone(tone),
    });
  },

  onLoad() {
    attachSampleTone(this);
    this.applyTone(this.data.tone);
  },

  onUnload() {
    detachSampleTone(this);
  },

  async handleTapMethod(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          id?: string;
        };
      };
    },
  ) {
    if (this.data.isRunning) {
      return;
    }

    const id = event.currentTarget?.dataset?.id;
    const method = this.data.methods.find((item) => item.id === id);
    if (!method) {
      return;
    }

    this.setData({
      isRunning: true,
      statusText: `执行中：${method.title}`,
      lastErrorText: '-',
    });

    try {
      if (id === 'short-default') {
        await vibrateShort();
      } else if (id === 'short-light') {
        await vibrateShort('light');
      } else if (id === 'short-medium') {
        await vibrateShort('medium');
      } else if (id === 'short-heavy') {
        await vibrateShort('heavy');
      } else if (id === 'long') {
        await vibrateLong();
      }

      this.setData({
        statusText: `已触发：${method.title}`,
        lastSuccessText: `${method.title} / ${method.description}`,
      });
    } catch (error) {
      const errorText = error instanceof Error ? error.message : String(error);
      this.setData({
        statusText: `失败：${method.title}`,
        lastErrorText: `${method.title} / ${errorText}`,
      });
    } finally {
      this.setData({ isRunning: false });
    }
  },

  async handleTapSequence() {
    if (this.data.isRunning) {
      return;
    }

    this.setData({
      isRunning: true,
      statusText: '执行中：连续短震动',
      lastErrorText: '-',
    });

    try {
      await vibrateShort('light');
      await new Promise<void>((resolve) => setTimeout(resolve, 160));
      await vibrateShort('medium');
      await new Promise<void>((resolve) => setTimeout(resolve, 160));
      await vibrateShort('heavy');

      this.setData({
        statusText: '已触发：连续短震动',
        lastSuccessText: '连续短震动 / light → medium → heavy',
      });
    } catch (error) {
      const errorText = error instanceof Error ? error.message : String(error);
      this.setData({
        statusText: '失败：连续短震动',
        lastErrorText: `连续短震动 / ${errorText}`,
      });
    } finally {
      this.setData({ isRunning: false });
    }
  },
});
