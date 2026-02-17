Page({
  data: {
    singleValue: 'order',
    multipleValues: ['order', 'shipping'],
    items: [
      {
        value: 'order',
        title: '订单信息',
        content: '订单号: NO.20260217001，状态: 已支付',
      },
      {
        value: 'shipping',
        title: '配送信息',
        content: '收货地址: 重庆渝中区，预计今天送达',
      },
      {
        value: 'invoice',
        title: '发票信息',
        content: '电子发票将发送至 chio@example.com',
      },
    ],
    disabledItems: [
      {
        value: 'order',
        title: '订单信息',
        content: '订单号: NO.20260217001，状态: 已支付',
      },
      {
        value: 'disabled',
        title: '禁用面板',
        content: '该面板不可交互',
        isDisabled: true,
      },
    ],
  },

  handleSingleChange(
    event: WechatMiniprogram.CustomEvent<{
      value?: string | number | null;
    }>,
  ) {
    this.setData({
      singleValue: event.detail?.value ?? '',
    });
  },

  handleMultipleChange(
    event: WechatMiniprogram.CustomEvent<{
      values?: Array<string | number>;
    }>,
  ) {
    this.setData({
      multipleValues: event.detail?.values ?? [],
    });
  },
});
