# 核心模块 (Core)

核心模块是 Rete.js 框架的基础，提供事件系统、上下文管理、数据验证和插件系统等功能。

## 模块结构

```
core/
├── context.ts      # 上下文管理类
├── data.ts         # 数据结构定义
├── emitter.ts      # 事件发射器
├── events.ts       # 事件类型定义
├── plugin.ts       # 插件接口定义
└── validator.ts    # 数据验证器
```

## 详细说明

### 1. Context (context.ts)

`Context` 类是框架的核心基类，继承自 `Emitter`，提供以下功能：

- **ID管理**: 验证并管理框架实例的唯一标识符
- **插件系统**: 通过 `use()` 方法注册和管理插件
- **组件注册**: 通过 `register()` 方法注册组件
- **事件系统**: 继承自 `Emitter`，提供事件触发和监听功能
- **生命周期管理**: 提供 `destroy()` 方法处理资源清理

```typescript
class Context<EventsTypes> extends Emitter<EventsTypes & DefaultEvents> {
  id: string;
  plugins: Map<string, unknown>;
  components: Map<string, Component>;

  use<T extends Plugin, O extends PluginParams<T>>(plugin: T, options?: O);
  register(component: Component);
  destroy();
}
```

### 2. Emitter (emitter.ts)

`Emitter` 类实现事件驱动架构，提供以下功能：

- **事件监听**: `on()` 方法注册事件处理器
- **事件触发**: `trigger()` 方法触发事件并传递参数
- **事件绑定**: `bind()` 方法绑定事件处理器
- **事件检查**: `exist()` 方法检查事件是否存在处理器

```typescript
class Emitter<EventTypes> {
  on<K extends keyof EventTypes>(names: K | K[], handler: (args: EventTypes[K]) => void | unknown): this;
  trigger<K extends keyof EventTypes>(name: K, params: EventTypes[K] | {} = {});
  bind(name: string);
  exist(name: string);
}
```

### 3. Events (events.ts)

`Events` 类定义事件处理器集合，提供默认事件处理器：

- **默认事件**:
  - `warn`: 控制台警告输出
  - `error`: 控制台错误输出
  - `componentregister`: 组件注册事件
  - `destroy`: 销毁事件

```typescript
class Events {
  handlers: {};
}

interface EventsTypes {
  warn: string | Error;
  error: string | Error;
  componentregister: Component;
  destroy: void;
}
```

### 4. Data (data.ts)

`data.ts` 定义框架所需的数据结构：

- **连接数据**:
  - `ConnectionData`: 基础连接数据
  - `InputConnectionData`: 输入连接数据
  - `OutputConnectionData`: 输出连接数据

- **IO数据**:
  - `InputData`: 输入数据
  - `OutputData`: 输出数据
  - `InputsData`: 输入数据集合
  - `OutputsData`: 输出数据集合

- **节点数据**:
  - `NodeData`: 单个节点数据
  - `NodesData`: 节点数据集合

- **工作数据**:
  - `WorkerInputs`: 工作输入
  - `WorkerOutputs`: 工作输出

```typescript
interface Data {
  id: string;
  nodes: NodesData;
}
```

### 5. Validator (validator.ts)

`Validator` 类提供数据验证功能：

- **数据验证**: `isValidData()` 验证数据格式
- **ID验证**: `isValidId()` 验证ID格式 (格式为 `name@version`)
- **整体验证**: `validate()` 验证ID和数据的一致性

```typescript
class Validator {
  static isValidData(data: Data);
  static isValidId(id: string);  // 格式: ^[\w-]{3,}@[0-9]+\.[0-9]+\.[0-9]+$
  static validate(id: string, data: Data);
}
```

### 6. Plugin (plugin.ts)

`Plugin` 接口定义插件结构：

- **插件名称**: `name` 属性
- **安装方法**: `install()` 方法，接收上下文和选项参数

```typescript
interface Plugin {
  name: string;
  install: (context: any, options?: any) => void;
}

type PluginParams<T extends Plugin> = T['install'] extends (arg1: unknown, arg2: infer U) => void ? U : void;
```

## 使用示例

```typescript
import { Context, Events } from './core';

// 创建上下文
const context = new Context('myapp@1.0.0', new Events({}));

// 注册组件
context.register(myComponent);

// 使用插件
context.use(myPlugin, { option: 'value' });

// 监听事件
context.on('componentregister', (component) => {
  console.log('Component registered:', component.name);
});
```

## 设计模式

核心模块采用了以下设计模式：

1. **观察者模式**: 通过 `Emitter` 实现事件系统
2. **工厂模式**: 通过 `Context` 管理组件和插件的创建
3. **策略模式**: 通过插件系统提供扩展机制
4. **组合模式**: 通过数据结构定义复杂的节点图结构