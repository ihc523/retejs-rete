# 引擎模块 (Engine)

引擎模块是 Rete.js 框架的执行核心，负责节点图的处理和执行，包括组件管理、工作流程控制、递归检测等功能。

## 模块结构

```
engine/
├── component.ts    # 组件基类定义
├── events.ts       # 引擎事件定义
├── index.ts        # 引擎主类定义
├── recursion.ts    # 递归检测器
└── state.ts        # 引擎状态定义
```

## 详细说明

### 1. Engine (index.ts)

`Engine` 类是框架的核心执行引擎，继承自 `Context`，提供以下功能：

- **流程控制**: 管理执行状态（可用、处理中、中止）
- **节点处理**: 执行节点图中的节点和连接
- **工作流程**: 协调组件的工作逻辑执行
- **递归检测**: 防止节点图中出现循环依赖
- **错误处理**: 提供错误报告和处理机制
- **执行控制**: 支持中止正在执行的流程

```typescript
class Engine extends Context<EventsTypes> {
  args: unknown[] = [];
  data: Data | null = null;
  state = State.AVAILABLE;
  forwarded = new Set();
  onAbort = () => { };

  async process<T extends unknown[]>(data: Data, startId: number | string | null = null, ...args: T);
  async abort();
  clone();
}
```

**关键方法**:

- `process()`: 执行节点图，接受数据和可选的起始节点ID
- `abort()`: 中止当前执行流程
- `clone()`: 创建引擎的副本
- `validate()`: 验证数据格式和递归

### 2. Component (component.ts)

`Component` 是所有节点组件的抽象基类，定义组件的基本结构：

- **组件名称**: 唯一标识组件的名称
- **工作方法**: 抽象的 `worker` 方法，定义节点的实际工作逻辑
- **引擎引用**: 对执行引擎的引用

```typescript
abstract class Component {
  name: string;
  data: unknown = {};
  engine: Engine | null = null;

  constructor(name: string);
  abstract worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]): void;
}
```

**使用方法**:
- 继承 `Component` 类创建自定义组件
- 实现 `worker` 方法定义节点的处理逻辑
- 在 `worker` 方法中处理输入数据并生成输出数据

### 3. Recursion (recursion.ts)

`Recursion` 类负责检测节点图中的循环依赖：

- **输入节点提取**: 从节点的输入连接中提取上游节点
- **递归检测**: 检测图中是否存在循环引用
- **冲突节点**: 返回检测到的第一个循环节点

```typescript
class Recursion {
  nodes: NodesData;

  constructor(nodes: NodesData);
  extractInputNodes(node: NodeData): NodeData[];
  detect(): NodeData | null;
}
```

**算法逻辑**:
- 遍历所有节点
- 对每个节点检查其输入连接的上游节点
- 使用递归算法检测是否存在循环依赖
- 如果发现循环，返回第一个检测到的循环节点

### 4. State (state.ts)

定义引擎的执行状态：

```typescript
enum State {
  AVAILABLE = 0,  // 可用状态
  PROCESSED = 1,  // 处理中状态
  ABORT = 2       // 中止状态
}
```

### 5. Events (events.ts)

引擎模块的事件定义，目前为空接口，但可以扩展以支持引擎特定的事件。

## 工作流程

引擎模块的工作流程如下：

1. **数据验证**: 验证输入数据的格式和ID匹配
2. **递归检测**: 检测节点图中是否存在循环依赖
3. **节点处理**: 从起始节点开始，按连接关系处理节点
4. **输入提取**: 从连接的上游节点提取输入数据
5. **工作执行**: 调用组件的 `worker` 方法处理数据
6. **结果传递**: 将输出数据传递给下游节点
7. **流程控制**: 管理执行状态和错误处理

## 使用示例

```typescript
import { Engine, Component } from './engine';
import { NodeData, WorkerInputs, WorkerOutputs } from './core/data';

// 定义自定义组件
class AddComponent extends Component {
  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    const input1 = inputs['input1'][0] || 0;
    const input2 = inputs['input2'][0] || 0;
    outputs['result'] = input1 + input2;
  }
}

// 创建引擎
const engine = new Engine('myapp@1.0.0');

// 注册组件
engine.register(new AddComponent('Add'));

// 执行节点图
const result = await engine.process(nodeGraphData);
```

## 并发处理

引擎支持以下并发处理特性：

- **节点锁定**: 使用锁机制防止节点重复处理
- **异步执行**: 支持异步的节点处理
- **流程中止**: 可以中止正在执行的流程
- **状态管理**: 严格的状态管理防止并发问题

## 错误处理

引擎模块提供完善的错误处理机制：

- **数据验证错误**: 验证输入数据格式
- **递归错误**: 检测并报告循环依赖
- **组件错误**: 捕获组件执行中的异常
- **执行错误**: 管理执行流程中的错误状态

## 性能优化

引擎模块通过以下方式优化性能：

- **结果缓存**: 缓存节点的执行结果避免重复计算
- **依赖追踪**: 只处理必要的节点和连接
- **异步处理**: 支持异步操作以提高响应性
- **资源管理**: 有效管理内存和计算资源