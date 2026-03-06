type MiniListboxItem = {
  id: string | number;
  label: string;
  isDisabled?: boolean;
  isSticky?: boolean;
};

function createStickyVerticalItems() {
  const items: MiniListboxItem[] = [];

  for (let sectionIndex = 0; sectionIndex < 20; sectionIndex += 1) {
    const sectionNo = sectionIndex + 1;

    items.push({
      id: `section-${sectionNo}`,
      label: `Section ${sectionNo}`,
      isSticky: true,
    });

    for (let row = 0; row < 40; row += 1) {
      const absoluteIndex = sectionIndex * 40 + row + 1;

      items.push({
        id: `item-${absoluteIndex}`,
        label: `Option ${absoluteIndex}`,
        isDisabled: absoluteIndex % 33 === 0,
      });
    }
  }

  return items;
}

function createStickyHorizontalItems() {
  const items: MiniListboxItem[] = [];

  for (let groupIndex = 0; groupIndex < 10; groupIndex += 1) {
    const groupNo = groupIndex + 1;

    items.push({
      id: `group-${groupNo}`,
      label: `Group ${groupNo}`,
      isSticky: true,
    });

    for (let tab = 0; tab < 12; tab += 1) {
      const absoluteIndex = groupIndex * 12 + tab + 1;

      items.push({
        id: `tab-${absoluteIndex}`,
        label: `Tab ${absoluteIndex}`,
      });
    }
  }

  return items;
}

Page({
  data: {
    stickyItems: createStickyVerticalItems(),
    horizontalStickyItems: createStickyHorizontalItems(),
    plainItems: Array.from({ length: 1000 }, (_, index) => ({
      id: index,
      label: `Option ${index + 1}`,
      isDisabled: index % 33 === 0,
    })),
    emptyItems: [],
    stickyPressed: 'none',
    horizontalPressed: 'none',
    plainPressed: 'none',
  },

  handleStickyItemTap(
    e: WechatMiniprogram.CustomEvent<{ item?: { id?: string | number } }>,
  ) {
    this.setData({
      stickyPressed: String(e.detail?.item?.id ?? 'none'),
    });
  },

  handleHorizontalItemTap(
    e: WechatMiniprogram.CustomEvent<{ item?: { id?: string | number } }>,
  ) {
    this.setData({
      horizontalPressed: String(e.detail?.item?.id ?? 'none'),
    });
  },

  handlePlainItemTap(
    e: WechatMiniprogram.CustomEvent<{ item?: { id?: string | number } }>,
  ) {
    this.setData({
      plainPressed: String(e.detail?.item?.id ?? 'none'),
    });
  },
});
