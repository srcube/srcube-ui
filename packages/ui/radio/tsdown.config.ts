import { createUIBuildConfig } from '@srcube-ui/config/tsdown.ui';

export default createUIBuildConfig({
  miniEntries: {
    'radio-group/index': 'src/mini/radio-group/index.ts',
  },
  miniCopy: [
    {
      from: 'src/mini/radio-group/*.{wxml,wxss,json,wxs}',
      to: 'dist/mini/radio-group',
      flatten: true,
    },
  ],
});
