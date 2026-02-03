import { createUIBuildConfig } from "@srcube-ui/config/tsdown.ui";

export default createUIBuildConfig({
  miniEntries: {
    "button-group/index": "src/mini/button-group/index.ts",
  },
  miniCopy: [
    {
      from: "src/mini/button-group/*.{wxml,wxss,json,wxs}",
      to: "dist/mini/button-group",
      flatten: true,
    },
  ],
});
