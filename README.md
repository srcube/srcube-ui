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

## Quick start
1. Install dependencies:
   - `pnpm install`
2. Add packages under `packages/`
3. Run tasks through Turbo:
   - `pnpm turbo build`
   - `pnpm turbo dev`
   - `pnpm turbo test`
   - `pnpm turbo lint`

Note: tasks run only when workspace packages define the matching scripts.

## Conventions
- ESM only (`"type": "module"`).
- Prefer TypeScript.
- Build outputs in `dist/` or `build/` (per `turbo.json`).

## License
MIT
