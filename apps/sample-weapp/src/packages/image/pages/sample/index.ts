Page({
  data: {
    coverUrl: 'https://picsum.photos/id/1015/800/800',
    videoUrl: 'https://picsum.photos/id/1002/1200/675',
    photoUrl: 'https://picsum.photos/id/1011/1200/900',
    ratioMode: 'video',
    radiusMode: 'lg',
    fitMode: 'cover',
    ratioPreviewUrl: 'https://picsum.photos/id/1002/1200/675',
    ratioOptions: [
      { label: 'Auto', value: 'auto' },
      { label: 'Square', value: 'square' },
      { label: 'Video', value: 'video' },
      { label: 'Photo', value: 'photo' },
    ],
    radiusOptions: [
      { label: 'None', value: 'none' },
      { label: 'SM', value: 'sm' },
      { label: 'MD', value: 'md' },
      { label: 'LG', value: 'lg' },
    ],
    fitOptions: [
      { label: 'Cover', value: 'cover' },
      { label: 'Contain', value: 'contain' },
      { label: 'Fill', value: 'fill' },
      { label: 'None', value: 'none' },
    ],
    previewUrls: [
      'https://picsum.photos/id/1015/1200/1200',
      'https://picsum.photos/id/1016/1200/1200',
    ],
  },

  handleRatioModeTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          value?: string;
        };
      };
    },
  ) {
    const value = String(event.currentTarget?.dataset?.value ?? '');
    if (value !== 'auto' && value !== 'square' && value !== 'video' && value !== 'photo') {
      return;
    }

    this.setData({
      ratioMode: value,
      ratioPreviewUrl: value === 'video' ? this.data.videoUrl : this.data.photoUrl,
    });
  },

  handleRadiusModeTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          value?: string;
        };
      };
    },
  ) {
    const value = String(event.currentTarget?.dataset?.value ?? '');
    if (value !== 'none' && value !== 'sm' && value !== 'md' && value !== 'lg') {
      return;
    }

    this.setData({
      radiusMode: value,
    });
  },

  handleFitModeTap(
    event: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          value?: string;
        };
      };
    },
  ) {
    const value = String(event.currentTarget?.dataset?.value ?? '');
    if (
      value !== 'cover'
      && value !== 'contain'
      && value !== 'fill'
      && value !== 'none'
    ) {
      return;
    }

    this.setData({
      fitMode: value,
    });
  },
});
