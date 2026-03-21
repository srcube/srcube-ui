Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
    tone: {
      type: String,
      value: 'default',
    },
    withBack: {
      type: Boolean,
      value: false,
    },
    pageClassName: {
      type: String,
      value: '',
    },
    contentClassName: {
      type: String,
      value: 'p-4 space-y-6',
    },
  },
});
