# 主要组件 (Components)

主要组件是 Rete.js 框架的核心构建块，包括节点、连接、输入输出、控件和插槽等。

## 模块结构

```
├── component.ts    # 组件基类
├── connection.ts   # 连接类
├── control.ts      # 控件类
├── editor.ts       # 编辑器主类
├── input.ts        # 输入类
├── io.ts           # 输入输出基类
├── node.ts         # 节点类
├── output.ts       # 输出类
├── selected.ts     # 选择管理
└── socket.ts       # 插槽类
```

## 详细说明

### 1. NodeEditor (editor.ts)

`NodeEditor` 是框架的主编辑器类，整合了所有功能：

- **继承自 Context**: 继承事件系统和插件管理功能
- **节点管理**: 管理节点的添加、删除和选择
- **连接管理**: 管理节点间的连接
- **视图管理**: 管理编辑器视图
- **选择管理**: 管理当前选中的节点
- **数据导入导出**: 支持从JSON导入和导出数据

```typescript
class NodeEditor extends Context<EventsTypes> {
  nodes: Node[] = [];
  selected = new Selected();
  view: EditorView;

  addNode(node: Node);
  removeNode(node: Node);
  connect(output: Output, input: Input, data?: unknown);
  removeConnection(connection: Connection);
  selectNode(node: Node, accumulate?: boolean);
  toJSON();
  fromJSON(json: Data);
}
```

**关键功能**:
- **事件处理**: 监听和处理各种编辑器事件
- **节点选择**: 支持单选和多选节点
- **连接创建**: 创建节点间的连接
- **数据持久化**: JSON格式的数据导入导出

### 2. Node (node.ts)

`Node` 类表示图中的一个处理单元：

- **节点标识**: 包含节点名称和唯一ID
- **位置信息**: 存储节点在工作区中的位置
- **IO管理**: 管理节点的输入、输出和控件
- **数据存储**: 存储节点相关的数据和元数据
- **连接管理**: 管理与该节点相关的所有连接

```typescript
class Node {
  name: string;
  id: number;
  position: [number, number];
  inputs = new Map<string, Input>();
  outputs = new Map<string, Output>();
  controls = new Map<string, Control>();
  data: {[key: string]: unknown};
  meta: {[key: string]: unknown};

  addInput(input: Input);
  addOutput(output: Output);
  addControl(control: Control);
  removeInput(input: Input);
  removeOutput(output: Output);
  removeControl(control: Control);
  getConnections();
  toJSON();
}
```

**节点ID管理**:
- `incrementId()`: 静态方法，递增并返回下一个ID
- `resetId()`: 静态方法，重置ID计数器

### 3. Component (component.ts)

`Component` 是节点组件的抽象基类，扩展自引擎模块的组件：

- **编辑器引用**: 持有对编辑器的引用
- **构建方法**: 提供节点构建的异步方法
- **节点创建**: 创建预配置的节点实例

```typescript
abstract class Component extends ComponentWorker {
  editor: NodeEditor | null = null;

  abstract builder(node: Node): Promise<void>;
  async build(node: Node);
  async createNode(data?: {});
}
```

**使用模式**:
- 继承 `Component` 创建自定义组件
- 实现 `builder` 方法配置节点的IO和控件
- 通过 `createNode` 方法创建节点实例

### 4. Connection (connection.ts)

`Connection` 类表示两个节点之间的连接：

- **连接两端**: 指向输出和输入
- **连接数据**: 存储连接相关的数据
- **连接管理**: 提供连接的添加和移除功能

```typescript
class Connection {
  output: Output;
  input: Input;
  data: unknown = {};

  constructor(output: Output, input: Input);
  remove();
}
```

### 5. IO (io.ts)

`IO` 是输入和输出的基类：

- **节点引用**: 指向所属的节点
- **连接管理**: 管理与此IO相关的连接
- **多连接支持**: 支持多个或单个连接
- **连接操作**: 提供连接的添加和移除方法

```typescript
class IO {
  node: Node | null;
  multipleConnections: boolean;
  connections: Connection[] = [];
  key: string;
  name: string;
  socket: Socket;

  removeConnection(connection: Connection);
  removeConnections();
}
```

### 6. Input (input.ts)

`Input` 类表示节点的输入端口：

- **控件支持**: 可以关联一个控件用于直接输入
- **连接限制**: 可配置是否允许多个连接
- **控件显示**: 在没有连接时显示关联的控件

```typescript
class Input extends IO {
  control: Control | null = null;

  constructor(key: string, title: string, socket: Socket, multiConns?: boolean);
  addControl(control: Control);
  showControl();
  hasConnection();
  toJSON();
}
```

### 7. Output (output.ts)

`Output` 类表示节点的输出端口：

- **连接创建**: 提供连接到输入的方法
- **兼容性检查**: 检查与输入的插槽兼容性
- **连接验证**: 验证连接的合法性

```typescript
class Output extends IO {
  constructor(key: string, title: string, socket: Socket, multiConns?: boolean);
  connectTo(input: Input);
  connectedTo(input: Input);
  hasConnection();
  toJSON();
}
```

### 8. Control (control.ts)

`Control` 类表示节点上的控件：

- **控件标识**: 包含唯一键值
- **父级引用**: 可以属于节点或输入
- **数据访问**: 提供对节点数据的读写访问

```typescript
class Control {
  key: string;
  data: unknown = {};
  parent: Node | Input | null = null;

  constructor(key: string);
  getNode();
  getData(key: string);
  putData(key: string, data: unknown);
}
```

**注意事项**:
- `Control` 是抽象类，不能直接实例化
- 通过继承实现具体的控件类型

### 9. Socket (socket.ts)

`Socket` 类定义连接的兼容性规则：

- **插槽名称**: 标识插槽类型
- **兼容性管理**: 定义与其他插槽的兼容关系
- **连接验证**: 验证连接的有效性

```typescript
class Socket {
  name: string;
  data: unknown;
  compatible: Socket[] = [];

  constructor(name: string, data?: {});
  combineWith(socket: Socket);
  compatibleWith(socket: Socket);
}
```

### 10. Selected (selected.ts)

`Selected` 类管理当前选中的节点：

- **选择管理**: 管理选中节点的集合
- **选择操作**: 提供添加、移除、清空选择的方法
- **迭代访问**: 提供遍历选中节点的方法

```typescript
class Selected {
  list: Node[] = [];

  add(node: Node, accumulate: boolean);
  remove(node: Node);
  clear();
  contains(node: Node);
  each(cb: (node: Node) => void);
}
```

## 组件关系

这些组件之间的关系如下：

```
NodeEditor
├── nodes (Node[])
├── selected (Selected)
├── view (EditorView)
└── components (Map<string, Component>)

Node
├── inputs (Map<string, Input>)
├── outputs (Map<string, Output>)
├── controls (Map<string, Control>)
└── connections (via Input/Output)

Input/Output (extends IO)
├── connections (Connection[])
├── socket (Socket)
├── node (Node)
└── control (Input only)

Connection
├── output (Output)
└── input (Input)

Socket
└── compatible (Socket[])

Control
└── parent (Node | Input)
```

## 使用示例

```typescript
import { NodeEditor, Component, Node, Input, Output, Socket } from '../';

// 创建编辑器
const editor = new NodeEditor('demo@1.0.0', container);

// 定义自定义组件
class NumberComponent extends Component {
  async builder(node: Node) {
    const inputSocket = new Socket('input');
    const outputSocket = new Socket('output');
    
    // 添加输入和输出
    node.addInput(new Input('num', 'Number', inputSocket));
    node.addOutput(new Output('result', 'Result', outputSocket));
  }

  worker(node, inputs, outputs) {
    outputs['result'] = inputs['num'][0] || 0;
  }
}

// 注册组件
editor.register(new NumberComponent('Number'));

// 创建节点
const node = await (editor.getComponent('Number') as NumberComponent).createNode();
editor.addNode(node);
```

## 设计模式

组件模块采用了以下设计模式：

1. **组合模式**: 通过节点、IO、连接的组合构建复杂的节点图
2. **工厂模式**: 通过组件的 `createNode` 方法创建节点实例
3. **观察者模式**: 通过事件系统实现组件间的解耦
4. **适配器模式**: 通过插槽实现不同类型的连接兼容
5. **模板方法模式**: 通过抽象的 `Component` 类定义节点创建流程