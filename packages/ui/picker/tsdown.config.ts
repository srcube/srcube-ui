import { createUIBuildConfig } from '@srcube-ui/config/tsdown.ui';

export default createUIBuildConfig({
  miniEntries: {
    'date-picker/index': 'src/mini/date-picker/index.ts',
  },
  miniCopy: [
    {
      from: 'src/mini/date-picker/index.{wxml,wxss,json,wxs}',
      to: 'dist/mini/date-picker',
      flatten: true,
    },
  ],
});
