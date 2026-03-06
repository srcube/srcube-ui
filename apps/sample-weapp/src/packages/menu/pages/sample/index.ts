Page({
  data: {
    controlledOpen: false,
    controlledValue: 'edit',
    menuItems: [
      { value: 'edit', label: '编辑' },
      { value: 'share', label: '分享' },
      { value: 'delete', label: '删除' },
    ],
    horizontalItems: [
      { value: 'all', label: '全部' },
      { value: 'todo', label: '待办' },
      { value: 'done', label: '已完成' },
    ],
    darkItems: [
      { value: 'low', label: '低优先级' },
      { value: 'high', label: '高优先级' },
      { value: 'urgent', label: '紧急', isDisabled: true },
    ],
  },

  handleOpenChange(
    event: WechatMiniprogram.CustomEvent<{
      isOpen?: boolean;
    }>,
  ) {
    this.setData({
      controlledOpen: Boolean(event.detail?.isOpen),
    });
  },

  handleSelect(
    event: WechatMiniprogram.CustomEvent<{
      value?: string;
    }>,
  ) {
    if (typeof event.detail?.value !== 'string') {
      return;
    }

    this.setData({
      controlledValue: event.detail.value,
    });
  },
});
