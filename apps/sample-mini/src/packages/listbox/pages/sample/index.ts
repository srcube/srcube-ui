Page({
  data: {
    items: Array.from({ length: 1000 }, (_, index) => ({
      id: index,
      label: `Option ${index + 1}`,
      isDisabled: index % 33 === 0,
    })),
    horizontalItems: Array.from({ length: 80 }, (_, index) => ({
      id: index,
      label: `Tab ${index + 1}`,
    })),
    emptyItems: [],
    horizontalSelectedKeys: [1],
    selectedKeys: [2],
  },

  handleSelectionChange(
    e: WechatMiniprogram.CustomEvent<{ selectedKeys: Array<string | number> }>,
  ) {
    this.setData({ selectedKeys: e.detail.selectedKeys });
  },
});
