Page({
  data: {
    isLoaded: false,
    isCardLoaded: false,
    radiusOptions: [
      { label: 'none', value: 'none' },
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
      { label: 'lg', value: 'lg' },
      { label: 'full', value: 'full' },
    ],
  },

  toggleLoaded() {
    this.setData({
      isLoaded: !this.data.isLoaded,
    });
  },

  toggleCardLoaded() {
    this.setData({
      isCardLoaded: !this.data.isCardLoaded,
    });
  },
});
