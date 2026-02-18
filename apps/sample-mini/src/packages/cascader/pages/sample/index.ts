Page({
  data: {
    options: [
      {
        id: 'zj',
        label: '浙江',
        children: [
          {
            id: 'hz',
            label: '杭州',
            children: [
              { id: 'xh', label: '西湖区' },
              { id: 'yh', label: '余杭区' },
            ],
          },
          {
            id: 'nb',
            label: '宁波',
            children: [{ id: 'jb', label: '江北区' }],
          },
        ],
      },
      {
        id: 'gd',
        label: '广东',
        children: [
          {
            id: 'sz',
            label: '深圳',
            children: [
              { id: 'ns', label: '南山区' },
              { id: 'ft', label: '福田区' },
            ],
          },
          {
            id: 'gz',
            label: '广州',
            children: [
              { id: 'th', label: '天河区' },
              { id: 'yx', label: '越秀区' },
            ],
          },
        ],
      },
    ],
    value: ['zj', 'hz', 'xh'],
  },

  handleValueChange(
    e: WechatMiniprogram.CustomEvent<{
      value?: Array<string | number | null>;
    }>,
  ) {
    this.setData({
      value: Array.isArray(e.detail?.value) ? e.detail.value : this.data.value,
    });
  },
});
