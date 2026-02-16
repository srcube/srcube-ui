const leftActions = [
  {
    key: 'pin',
    label: '置顶',
    color: 'primary',
  },
] as const;

const rightActions = [
  {
    key: 'more',
    label: '',
    color: 'secondary',
    iconClassName: 'icon-[ic--outline-more-horiz] text-lg',
  },
  {
    key: 'delete',
    label: '',
    color: 'danger',
    iconClassName: 'icon-[fa7-solid--trash] text-base',
  },
] as const;

type SwipeDirection = 'none' | 'left' | 'right';

Page({
  data: {
    leftActions,
    rightActions,
    customLeftActions: [
      {
        key: 'archive',
        label: '归档',
        color: 'success',
      },
    ],
    customRightActions: [
      {
        key: 'delete',
        label: '',
        color: 'danger',
        iconClassName: 'icon-[fa7-solid--trash] text-base',
      },
    ],
    controlledDirection: 'none' as SwipeDirection,
    lastAction: 'none',
  },

  handleAction(
    e: WechatMiniprogram.CustomEvent<{
      key?: string | number;
      direction?: SwipeDirection;
    }>,
  ) {
    const direction = e.detail?.direction ?? 'none';
    const key = e.detail?.key ?? 'unknown';

    this.setData({
      lastAction: `${direction}:${String(key)}`,
    });
  },

  handleControlledOpenChange(
    e: WechatMiniprogram.CustomEvent<{
      openDirection?: SwipeDirection;
    }>,
  ) {
    const direction = e.detail?.openDirection;
    if (!direction) {
      return;
    }

    this.setData({
      controlledDirection: direction,
    });
  },

  handleDirectionTap(
    e: WechatMiniprogram.TouchEvent & {
      currentTarget: {
        dataset: {
          direction?: SwipeDirection;
        };
      };
    },
  ) {
    const direction = e.currentTarget?.dataset?.direction;
    if (!direction) {
      return;
    }

    this.setData({
      controlledDirection: direction,
    });
  },
});
