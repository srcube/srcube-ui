# @srcube-ui/storybook

srcube-ui 的 Storybook 应用，用于承载 React Web 组件的可视化预览、交互状态验证与文档展示。

## 当前能力
- Storybook 8 + React + Vite
- 共享 `@srcube-ui/styles` 全局样式
- 直接解析 `@srcube-ui/react` 源码，方便边开发边验收
- 已提供 Overview 首页与 `Button` 组件 story

## 启动
```bash
pnpm dev:storybook
```

## 构建
```bash
pnpm build:storybook
```

## 目录
- `.storybook/` - Storybook 主配置
- `src/stories/` - stories 与展示页面
- `src/lib/` - Storybook 内部复用布局
