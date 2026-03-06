Page({
  data: {
    items: Array.from({ length: 10 }, (_, index) => ({
      id: index,
      label: `Item ${index + 1}`,
    })),
    cards: Array.from({ length: 8 }, (_, index) => ({
      id: index,
      label: `Card ${index + 1}`,
    })),
  },
});
