import { createUIBuildConfig } from '@srcube-ui/config/tsdown.ui';

export default createUIBuildConfig({
  miniEntries: {
    'tab-panel/index': 'src/mini/tab-panel/index.ts',
  },
  miniCopy: [
    {
      from: 'src/mini/tab-panel/*.{wxml,wxss,json,wxs}',
      to: 'dist/mini/tab-panel',
      flatten: true,
    },
  ],
});
