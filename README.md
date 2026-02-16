# srcube-ui

A UI component library workspace for React and MiniProgram.

## Status
This repo is scaffolded; `apps/` and `packages/` are currently empty. This README is a starter and should be updated as packages land.

## Workspace layout
- `apps/` demo apps, docs site, playgrounds
- `packages/` publishable libraries
- `pnpm-workspace.yaml` workspace config
- `turbo.json` task pipeline

## Requirements
- Node.js (LTS recommended)
- pnpm 10.x

## Getting Started
### 1) 安装依赖
```bash
pnpm install
```

### 2) 本地开发
```bash
# 同时启动 workspace dev 任务
pnpm dev

# 只启动 React 示例
pnpm dev:react

# 只启动 Mini 示例
pnpm dev:mini
```

### 3) 构建
```bash
# 构建整个 workspace
pnpm build

# 仅构建 packages 下的包
pnpm build:pkg
```

### 4) 校验
```bash
pnpm test
pnpm lint
pnpm format
```

### 5) 新增组件（推荐流程）
1. 复制模板：`packages/ui/_template` → `packages/ui/<component-name>`
2. 按顺序实现：`style.ts` → `react/*` → `mini/*`
3. 同步更新 README 的 API 表，保持 React / Mini 语义一致

## Conventions
- ESM only (`"type": "module"`).
- Prefer TypeScript.
- Build outputs in `dist/` or `build/` (per `turbo.json`).

## License
MIT
