# @srcube-ui/config

仓库共享配置包（内部使用）。

## 内容
- `tsconfig/base.json`: 通用 TS 基础配置
- `tsconfig/react.json`: React 侧 TS 配置
- `tsconfig/mini.json`: Mini 侧 TS 配置

## 使用方式
各 package 的 `tsconfig.json` 通过相对路径继承：
- `../_config/tsconfig/base.json`
- `../_config/tsconfig/react.json`
- `../_config/tsconfig/mini.json`
