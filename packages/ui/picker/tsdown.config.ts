import { createUIBuildConfig } from '@srcube-ui/config/tsdown.ui';

export default createUIBuildConfig({
  miniEntries: {
    'date-range-picker/index': 'src/mini/date-range-picker/index.ts',
    'date-picker/index': 'src/mini/date-picker/index.ts',
    'picker-datetime-range/index': 'src/mini/picker-datetime-range/index.ts',
    'picker-datetime/index': 'src/mini/picker-datetime/index.ts',
    'time-picker/index': 'src/mini/time-picker/index.ts',
  },
  miniCopy: [
    {
      from: 'src/mini/date-range-picker/index.{wxml,wxss,json,wxs}',
      to: 'dist/mini/date-range-picker',
      flatten: true,
    },
    {
      from: 'src/mini/date-picker/index.{wxml,wxss,json,wxs}',
      to: 'dist/mini/date-picker',
      flatten: true,
    },
    {
      from: 'src/mini/picker-datetime-range/index.{wxml,wxss,json,wxs}',
      to: 'dist/mini/picker-datetime-range',
      flatten: true,
    },
    {
      from: 'src/mini/picker-datetime/index.{wxml,wxss,json,wxs}',
      to: 'dist/mini/picker-datetime',
      flatten: true,
    },
    {
      from: 'src/mini/time-picker/index.{wxml,wxss,json,wxs}',
      to: 'dist/mini/time-picker',
      flatten: true,
    },
  ],
});
