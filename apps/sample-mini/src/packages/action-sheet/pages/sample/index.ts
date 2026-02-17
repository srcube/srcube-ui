Page({
  data: {
    isOpen: false,
    result: '-',
    actions: [
      {
        value: 'edit',
        label: '编辑',
        description: '修改当前内容',
      },
      {
        value: 'share',
        label: '分享',
        description: '分享给好友',
      },
      {
        value: 'delete',
        label: '删除',
        description: '删除后不可恢复',
        color: 'danger',
      },
    ],
  },

  handleOpen() {
    this.setData({
      isOpen: true,
    });
  },

  handleChange(
    event: WechatMiniprogram.CustomEvent<{
      isOpen?: boolean;
    }>,
  ) {
    this.setData({
      isOpen: Boolean(event.detail?.isOpen),
    });
  },

  handleAction(
    event: WechatMiniprogram.CustomEvent<{
      value?: string | number;
    }>,
  ) {
    this.setData({
      result: String(event.detail?.value ?? '-'),
    });
  },
});
