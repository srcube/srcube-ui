# srcube-ui

移动端组件库，支持 React Web 与小程序双平台。

## 架构

三层分离架构：
- `@srcube-ui/styles` - 样式契约层（theme + variants）
- `@srcube-ui/react` - React 组件实现
- `@srcube-ui/mini` - 小程序组件实现

详见 [ARCHITECTURE.md](./ARCHITECTURE.md)

## 快速开始

### 安装依赖
```bash
pnpm install
```

### 开发
```bash
pnpm dev          # 启动所有
pnpm dev:react    # 仅 React 示例
pnpm dev:weapp    # 仅小程序示例
```

### 构建
```bash
pnpm build        # 构建所有
pnpm build:pkg    # 仅构建 packages
```

### 测试与校验
```bash
pnpm test
pnpm lint
pnpm format
```

## 组件开发

### 开发流程
1. 定义样式契约：`packages/styles/src/components/<name>/style.ts`
2. 实现 React 组件：`packages/react/src/components/<name>/`
3. 实现小程序组件：`packages/mini/src/components/<name>/`
4. 编写文档：`react/docs/` 和 `mini/docs/`
5. 编写测试：`react/__tests__/` 和 `mini/__tests__/`

### 核心约定
- 样式通过 `style.ts` + slots 输出，禁止直接写 Tailwind 类
- 双平台 API 语义一致，文档 API 表为唯一真相
- 布尔命名：`is/has/should/can`
- React 交互组件使用 React Aria Components
- 小程序组件保留必要原生字段

详见 [ARCHITECTURE.md](./ARCHITECTURE.md)

## Workspace 结构
```txt
apps/
  sample-react/      # React 示例
  sample-weapp/       # 小程序示例
packages/
  styles/            # 样式契约
  react/             # React 实现
  mini/              # 小程序实现
  _config/           # 构建配置
  _storybook/        # 文档配置
```

## License
MIT
