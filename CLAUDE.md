# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

用图片和文本拼接输出图片的工具。支持加载 Excel 批量生成图片（用 Excel 行数据替换文本占位符），支持 zip 打包导出。

## 命令

```bash
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run start    # 启动生产服务
npm run lint     # ESLint 检查
```

## 技术栈

Next.js 12.0.9, React 17, MUI 5, @svgdotjs/svg.js (SVG 画布), canvg (SVG→Canvas→PNG), ExcelJS + SheetJS (Excel 解析), JSZip (打包)

## 架构

单页面应用，入口 `pages/index.tsx`，无路由。

### Manager 层（单例，`src/manager/`）

| 文件 | 职责 |
|------|------|
| `SceneControls.ts` | SVG 画布管理：场景/view 双 Svg 结构、平移、选中、缩放、序列化 |
| `ObjectMgr.ts` | 场景对象 CRUD、文本占位符解析 `{{col}}` / `{{col,2}}`（数字保留 2 位小数）、根据 Excel 行替换占位符 |
| `ExcelMgr.ts` | Excel 加载，支持 ExcelJS 和 SheetJS 两种后端（`ExcelMgr.type` 切换） |
| `OutMgr.ts` | 导出核心：SVG→Canvas→PNG，zip 分片打包（`Basic.zipPackLimit` 控制每包数量） |
| `EventMgr.ts` | `EventDispatcher` 的别名单例 |
| `EventDispatcher.ts` | 自定义事件总线，组件间通信用 |
| `FontMgr.ts` | 系统字体检测（canvas 测量）与字体列表 |

### Object 层（`src/object/`）

- `_baseObj.ts` — 基类，持有 `svgItem`、选中状态、序列化接口
- `TextObj.ts` — SVG `<text>`，属性：字体/字号/颜色/对齐
- `ImageObj.ts` — 嵌套 Svg + `<image>`，属性：位置/尺寸/viewBox

### 数据流

1. 加载 Excel → `ExcelMgr.openExcel()`
2. 添加图层 → `ObjectMgr.addText()` / `addImage()`，挂载到 `SceneControls.view`
3. 属性编辑 → 通过 `EventMgr` 派发事件通知 `PropertyList` 刷新
4. 导出 → `OutMgr.outImageLogic()` 遍历 Excel 行，用 `ObjectMgr.getRealText()` 替换 `{{placeholder}}`，canvg 渲染 SVG 到 Canvas，输出 PNG，JSZip 打包下载

### 事件系统

所有跨组件通信通过 `EventMgr.getIns().dispatchEvent(EventEnum.xxx, data)` 实现。事件名定义在 `src/events/EventEnum.ts`。组件在 constructor 中注册监听，使用 `Basic.EventObj_*` 作为 caller 标识以便 `removeByCaller`。

### 全局变量

`pages/index.tsx` 在 `useEffect` 中将 manager 单例和库暴露到 `window` 上（`window.Basic`, `window.objectMgr` 等），供外部脚本通过浏览器控制台操作。

## 贡献指南

### 项目结构

- `pages/index.tsx` 是主界面入口；`pages/api/` 目前仅保留默认 API 示例。
- `components/` 放 React UI 面板，属性编辑项在 `components/propertyItem/`。
- `src/manager/` 放单例管理器，负责画布、事件、Excel、对象、字体和导出。
- `src/object/` 放可绘制对象类，如 `TextObj`、`ImageObj`。
- `src/events/`、`src/display/`、`src/utils/` 放共享枚举、显示模型和工具函数。
- `public/` 放静态资源和字体 CSS；`styles/` 放全局和页面样式。

### 开发命令

```bash
npm install      # 首次安装依赖
npm run dev      # 启动本地开发服务器
npm run build    # 生产构建
npm run start    # 启动生产服务
npm run lint     # Next.js ESLint 检查
```

提交前至少运行 `npm run lint` 和 `npm run build`。

### 编码风格

- 使用 TypeScript、React 17、MUI 5，保持邻近代码风格。
- TS/TSX 使用 2 空格缩进。
- 命名沿用现有模式：管理器用 `*Mgr`，场景对象用 `*Obj`，事件名集中在 `EventEnum`。
- 变更必须小而直接，不顺手重构无关模块。
- 错误尽早暴露；不要用 `?? 0` 或宽泛 `try/catch` 隐藏无效状态。

### 测试要求

当前未配置独立测试框架。新增测试时必须验证真实业务结果，例如 Excel 占位符替换、对象序列化、导出命名或事件派发效果。禁止硬编码无效断言；删掉核心逻辑还能通过的测试应视为无效。

没有自动测试覆盖时，需要手动验证受影响的浏览器流程，并运行：

```bash
npm run lint
npm run build
```

### 提交与 PR

Git 历史使用简短中文提交信息，例如 `修复场景名无法更改的问题`、`增加zip打包导出`。保持单一主题、说明结果。

PR 应包含：变更内容和原因、验证命令和手动检查结果、UI 变更截图或录屏、相关 issue 或任务链接（如有）。

### Agent 注意事项

需要浏览器自动化时使用 `agent-browser`。排查 Bug 时不要提前清理调试日志，确认问题彻底解决后，只清理本次变更引入的日志。
