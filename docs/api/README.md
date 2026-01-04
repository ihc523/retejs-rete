# API 参考文档

Rete.js 框架提供了完整的 API 接口，用于创建和管理可视化节点编辑器。

## 主要导出

### 类导出

```typescript
import {
  Engine, Recursion
  Component,
  Control,
  Connection,
  Emitter,
  Input,
  IO,
  Node,
  NodeEditor,
  Output,
  Socket
} from 'rete';
```

### 默认导出

```typescript
import Rete from 'rete';

// 等价于
const Rete = {
  Engine,
  Recursion,
  Component,
  Control,
  Connection,
  Emitter,
  Input,
  IO,
  Node,
  NodeEditor,
  Output,
  Socket
}
```

## 核心 API

### NodeEditor

主编辑器类，整合所有功能。

#### 构造函数
```typescript
new NodeEditor(id: string, container: HTMLElement)
```
- `id`: 编辑器标识符，格式为 `name@version`
- `container`: DOM 容器元素

#### 实例方法

**节点管理**
```typescript
addNode(node: Node): void
removeNode(node: Node): void
selectNode(node: Node, accumulate?: boolean): void
```

**连接管理**
```typescript
connect(output: Output, input: Input, data?: unknown): void
removeConnection(connection: Connection): void
```

**数据管理**
```typescript
toJSON(): Data
fromJSON(json: Data): Promise<boolean>
```

**其他方法**
```typescript
getComponent(name: string): Component
register(component: Component): void
clear(): void
```

### Component

节点组件的抽象基类。

#### 构造函数
```typescript
constructor(name: string)
```

#### 抽象方法
```typescript
abstract builder(node: Node): Promise<void>
```

#### 实例方法
```typescript
async build(node: Node): Node
async createNode(data?: {}): Promise<Node>
```

### Node

节点类，表示图中的一个处理单元。

#### 构造函数
```typescript
constructor(name: string)
```

#### 实例方法

**IO 管理**
```typescript
addInput(input: Input): this
addOutput(output: Output): this
addControl(control: Control): this

removeInput(input: Input): void
removeOutput(output: Output): void
removeControl(control: Control): void
```

**连接管理**
```typescript
getConnections(): Connection[]
```

**数据方法**
```typescript
toJSON(): NodeData
setMeta(meta: {[key: string]: unknown}): this
```

### Connection

连接类，表示两个节点之间的连接。

#### 构造函数
```typescript
constructor(output: Output, input: Input)
```

#### 属性
```typescript
output: Output
input: Input
data: unknown
```

### Input/Output

输入和输出类，继承自 IO 基类。

#### 构造函数
```typescript
// Input
constructor(key: string, title: string, socket: Socket, multiConns?: boolean)

// Output
constructor(key: string, title: string, socket: Socket, multiConns?: boolean)
```

#### 实例方法

**连接操作**
```typescript
// Input
hasConnection(): boolean
addConnection(connection: Connection): void
showControl(): boolean

// Output
hasConnection(): boolean
connectTo(input: Input): Connection
connectedTo(input: Input): boolean
```

### Socket

插槽类，定义连接兼容性。

#### 构造函数
```typescript
constructor(name: string, data?: {})
```

#### 实例方法
```typescript
combineWith(socket: Socket): void
compatibleWith(socket: Socket): boolean
```

### Control

控件类，提供节点交互。

#### 构造函数
```typescript
constructor(key: string)
```

#### 实例方法
```typescript
getNode(): Node
getData(key: string): unknown
putData(key: string, data: unknown): void
```

### Engine

执行引擎类。

#### 构造函数
```typescript
constructor(id: string)
```

#### 实例方法
```typescript
async process<T extends unknown[]>(data: Data, startId?: number | string | null, ...args: T): Promise<'success' | 'aborted'>
async abort(): Promise<void>
clone(): Engine
```

### Emitter

事件发射器类。

#### 实例方法
```typescript
on<K extends keyof EventTypes>(names: K | K[], handler: (args: EventTypes[K]) => void | unknown): this
trigger<K extends keyof EventTypes>(name: K, params?: EventTypes[K]): boolean
bind(name: string): void
exist(name: string): boolean
```

## 数据类型

### NodeData
```typescript
interface NodeData {
  id: number;
  name: string;
  inputs: InputsData;
  outputs: OutputsData;
  data: {[key: string]: unknown};
  position: [number, number];
}
```

### ConnectionData
```typescript
interface ConnectionData {
  node: number;
  data: unknown;
}

type InputConnectionData = ConnectionData & {
  output: string;
}

type OutputConnectionData = ConnectionData & {
  input: string;
}
```

### Data
```typescript
interface Data {
  id: string;        // 格式: name@version
  nodes: NodesData;  // { [id: string]: NodeData }
}
```

## 事件系统

Rete.js 使用事件驱动架构，支持以下事件：

### 编辑器事件
- `nodecreate`: 节点创建前
- `nodecreated`: 节点创建后
- `noderemove`: 节点移除前
- `noderemoved`: 节点移除后
- `connectioncreate`: 连接创建前
- `connectioncreated`: 连接创建后
- `connectionremove`: 连接移除前
- `connectionremoved`: 连接移除后
- `selectnode`: 节点选择
- `nodeselect`: 节点选择前
- `nodeselected`: 节点选择后
- `nodedragged`: 节点拖拽后
- `nodetranslate`: 节点移动中
- `nodetranslated`: 节点移动后
- `keydown`: 键盘按下
- `keyup`: 键盘释放
- `click`: 点击工作区
- `contextmenu`: 右键菜单
- `export`: 数据导出
- `import`: 数据导入
- `clear`: 编辑器清空

### 视图事件
- `rendernode`: 渲染节点
- `renderconnection`: 渲染连接
- `rendersocket`: 渲染插槽
- `rendercontrol`: 渲染控件
- `updateconnection`: 更新连接
- `mousemove`: 鼠标移动
- `translate`: 工作区平移
- `translated`: 工作区平移后
- `zoom`: 工作区缩放
- `zoomed`: 工作区缩放后

### 系统事件
- `warn`: 警告信息
- `error`: 错误信息
- `componentregister`: 组件注册
- `destroy`: 销毁

## 使用示例

### 基础使用
```typescript
import { NodeEditor, Component, Node, Input, Output, Socket } from 'rete';

// 创建编辑器
const container = document.querySelector('#rete');
const editor = new NodeEditor('demo@1.0.0', container);

// 创建自定义组件
class NumberComponent extends Component {
  constructor() {
    super('Number');
  }

  async builder(node) {
    const socket = new Socket('Number socket');

    node.addInput(new Input('num', 'Number', socket));
    node.addOutput(new Output('num', 'Number', socket));
  }

  worker(node, inputs, outputs) {
    outputs['num'] = node.data && node.data['num'] || 0;
  }
}

// 注册组件
editor.register(new NumberComponent());

// 创建并添加节点
const node = await (editor.getComponent('Number')).createNode({ num: 5 });
editor.addNode(node);
```

### 事件处理
```typescript
// 监听节点创建事件
editor.on('nodecreate', (node) => {
  console.log('Node created:', node.name);
});

// 监听连接创建事件
editor.on('connectioncreated', (connection) => {
  console.log('Connection created:', connection);
});

// 阻止节点创建
editor.on('nodecreate', (node) => {
  if (someCondition) {
    return false; // 阻止节点创建
  }
});
```

### 数据导入导出
```typescript
// 导出数据
const data = editor.toJSON();

// 导入数据
await editor.fromJSON(data);
```

### 执行引擎
```typescript
import { Engine } from 'rete';

// 创建引擎
const engine = new Engine('demo@1.0.0');

// 注册组件
engine.register(new NumberComponent());

// 执行节点图
const result = await engine.process(data);
```