import { createUIBuildConfig } from '@srcube-ui/config/tsdown.ui';

export default createUIBuildConfig({
  miniEntries: {
    'checkbox-group/index': 'src/mini/checkbox-group/index.ts',
  },
  miniCopy: [
    {
      from: 'src/mini/checkbox-group/*.{wxml,wxss,json,wxs}',
      to: 'dist/mini/checkbox-group',
      flatten: true,
    },
  ],
});
