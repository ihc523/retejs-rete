# Rete.js 项目文档

## 项目概述

Rete.js 是一个用于可视化编程的模块化框架。它允许您直接在浏览器中创建基于节点的编辑器。您可以定义节点和工作者，允许用户在编辑器中创建指令来处理数据，而无需编写任何代码。

## 版本信息

- **版本**: 1.5.2
- **类型**: JavaScript/TypeScript 框架
- **许可证**: MIT

## 核心概念

Rete.js 项目主要由以下几个核心部分组成：

### 1. 核心模块 (Core)
- **Context**: 基础上下文类，提供插件管理和组件注册功能
- **Emitter**: 事件发射器，实现事件系统
- **Validator**: 数据验证器，确保数据格式正确
- **Data**: 定义数据结构，包括节点、连接等的数据格式

### 2. 引擎模块 (Engine)
- **Engine**: 核心引擎，负责处理节点图的执行流程
- **Component**: 组件基类，定义节点的工作逻辑
- **Recursion**: 递归检测器，防止节点图中出现循环依赖

### 3. 视图模块 (View)
- **EditorView**: 编辑器视图，负责渲染节点和连接
- **NodeView**: 节点视图，处理节点的显示和交互
- **ConnectionView**: 连接视图，负责渲染节点之间的连接
- **Area**: 工作区，处理缩放和拖拽功能

### 4. 主要组件
- **NodeEditor**: 节点编辑器，整合所有功能的主类
- **Node**: 节点类，表示图中的一个处理单元
- **Connection**: 连接类，连接两个节点的输入和输出
- **Input/Output**: 输入输出类，定义节点的连接点
- **Control**: 控件类，节点上的交互控件
- **Socket**: 插槽类，定义连接的兼容性

## 项目架构

```
src/
├── core/           # 核心功能模块
│   ├── context.ts
│   ├── data.ts
│   ├── emitter.ts
│   ├── events.ts
│   ├── plugin.ts
│   └── validator.ts
├── engine/         # 引擎模块
│   ├── component.ts
│   ├── events.ts
│   ├── index.ts
│   ├── recursion.ts
│   └── state.ts
├── view/           # 视图模块
│   ├── area.ts
│   ├── connection.ts
│   ├── control.ts
│   ├── drag.ts
│   ├── index.ts
│   ├── node.ts
│   ├── socket.ts
│   ├── utils.ts
│   └── zoom.ts
├── component.ts    # 组件定义
├── connection.ts   # 连接定义
├── control.ts      # 控件定义
├── editor.ts       # 编辑器主类
├── events.ts       # 事件定义
├── input.ts        # 输入定义
├── io.ts           # 输入输出基类
├── node.ts         # 节点定义
├── output.ts       # 输出定义
├── selected.ts     # 选择管理
└── socket.ts       # 插槽定义
```

## 功能特性

1. **可视化节点编辑**: 提供拖拽式的节点编辑界面
2. **事件系统**: 基于Emitter的事件驱动架构
3. **插件系统**: 支持扩展功能的插件机制
4. **数据验证**: 确保节点图数据的完整性
5. **递归检测**: 防止节点图中出现循环依赖
6. **连接管理**: 处理节点间的连接关系
7. **视图渲染**: 提供节点和连接的可视化展示
8. **缩放和平移**: 支持工作区的缩放和拖拽操作

## 使用场景

Rete.js 适用于以下场景:
- 流程图编辑器
- 可视化编程环境
- 工作流管理系统
- 数据处理管道
- 游戏行为树编辑器
- 音频/视频处理工具
- 机器人编程界面

## API 概览

主要的导出类和接口:

- `NodeEditor`: 主编辑器类
- `Engine`: 节点执行引擎
- `Component`: 节点组件基类
- `Node`: 节点类
- `Connection`: 连接类
- `Input/Output`: 输入输出类
- `Control`: 控件类
- `Socket`: 插槽类
- `Emitter`: 事件发射器

## 开发工具

- **TypeScript**: 类型安全的开发语言
- **ESLint**: 代码质量检查
- **Mocha**: 测试框架
- **NYC**: 代码覆盖率工具
- **Babel**: JavaScript 编译器

## 项目构建

项目支持多种构建格式:
- **CommonJS**: `build/rete.common.js`
- **ES Module**: `build/rete.esm.js`
- **类型定义**: `types/index.d.ts`