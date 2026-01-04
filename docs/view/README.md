# 视图模块 (View)

视图模块负责 Rete.js 框架的用户界面渲染和交互，包括节点视图、连接视图、工作区管理、拖拽和缩放等功能。

## 模块结构

```
view/
├── area.ts         # 工作区管理
├── connection.ts   # 连接视图
├── control.ts      # 控件视图
├── drag.ts         # 拖拽功能
├── index.ts        # 编辑器视图主类
├── node.ts         # 节点视图
├── socket.ts       # 插槽视图
├── utils.ts        # 工具函数
└── zoom.ts         # 缩放功能
```

## 详细说明

### 1. EditorView (index.ts)

`EditorView` 类是整个视图系统的主控制器，负责管理所有视图组件：

- **容器管理**: 管理渲染容器和DOM元素
- **组件映射**: 维护组件到视图的映射关系
- **节点视图管理**: 管理节点视图的添加、移除和更新
- **连接视图管理**: 管理连接视图的添加、移除和更新
- **工作区管理**: 管理工作区（Area）实例
- **事件处理**: 处理点击、右键菜单等用户交互事件

```typescript
class EditorView extends Emitter<EventsTypes> {
  container: HTMLElement;
  components: Map<string, Component>;
  nodes = new Map<Node, NodeView>();
  connections = new Map<Connection, ConnectionView>();
  area: Area;

  addNode(node: Node);
  removeNode(node: Node);
  addConnection(connection: Connection);
  removeConnection(connection: Connection);
  updateConnections({ node }: { node: Node });
}
```

### 2. NodeView (node.ts)

`NodeView` 类负责单个节点的渲染和交互：

- **DOM元素**: 创建和管理节点的DOM元素
- **拖拽支持**: 支持节点的拖拽移动
- **IO视图**: 管理节点的输入、输出和控件视图
- **位置更新**: 更新节点在工作区中的位置
- **事件处理**: 处理节点选择、拖拽、上下文菜单等事件

```typescript
class NodeView extends Emitter<EventsTypes> {
  node: Node;
  component: Component;
  sockets = new Map<IO, SocketView>();
  controls = new Map<Control, ControlView>();
  el: HTMLElement;

  bindSocket(el: HTMLElement, type: string, io: IO);
  bindControl(el: HTMLElement, control: Control);
  getSocketPosition(io: IO);
  translate(x: number, y: number);
}
```

### 3. ConnectionView (connection.ts)

`ConnectionView` 类负责连接线的渲染：

- **连接管理**: 绑定输入和输出节点视图
- **位置计算**: 计算连接线的起点和终点位置
- **视图更新**: 更新连接线的位置和形状
- **事件处理**: 触发连接渲染和更新事件

```typescript
class ConnectionView extends Emitter<EventsTypes> {
  connection: Connection;
  inputNode: NodeView;
  outputNode: NodeView;
  el: HTMLElement;

  getPoints();
  update();
}
```

### 4. Area (area.ts)

`Area` 类管理整个工作区的视图：

- **变换管理**: 管理工作区的平移和缩放变换
- **鼠标位置**: 跟踪鼠标在工作区中的位置
- **拖拽支持**: 支持整个工作区的拖拽平移
- **缩放支持**: 集成缩放功能
- **DOM管理**: 管理工作区的DOM元素

```typescript
interface Transform { k: number; x: number; y: number }
interface Mouse { x: number; y: number }

class Area extends Emitter<EventsTypes> {
  el: HTMLElement;
  container: HTMLElement;
  transform: Transform;
  mouse: Mouse;

  translate(x: number, y: number);
  zoom(zoom: number, ox?: number, oy?: number, source?: ZoomSource);
  update();
}
```

### 5. Zoom (zoom.ts)

`Zoom` 类实现工作区的缩放功能：

- **滚轮缩放**: 支持鼠标滚轮缩放
- **双击缩放**: 支持双击缩放
- **多点触控**: 支持多点触控缩放和平移
- **缩放中心**: 以鼠标位置为中心进行缩放
- **变换计算**: 计算缩放后的变换参数

```typescript
class Zoom {
  el: HTMLElement;
  intensity: number;
  onzoom: Function;

  get translating();  // 是否在多点触控平移模式
}
```

### 6. Drag (drag.ts)

`Drag` 类提供拖拽功能：

- **拖拽检测**: 检测拖拽开始、移动和结束
- **位移计算**: 计算拖拽过程中的位移
- **事件回调**: 提供拖拽过程中的回调函数
- **选择处理**: 处理拖拽选择事件

```typescript
class Drag {
  constructor(
    el: HTMLElement,
    onTranslate: (dx: number, dy: number) => void,
    onSelect: (e: MouseEvent) => void,
    onDrag?: () => void
  );
  destroy();
}
```

### 7. SocketView (socket.ts)

`SocketView` 类管理IO插槽的视图：

- **位置计算**: 计算插槽在节点中的绝对位置
- **视图绑定**: 将插槽与DOM元素绑定
- **位置更新**: 更新插槽的显示位置

```typescript
class SocketView {
  constructor(el: HTMLElement, type: string, io: IO, node: Node, nodeView: NodeView);
  getPosition(node: Node, nodeEl: HTMLElement);
}
```

### 8. ControlView (control.ts)

`ControlView` 类管理控件的视图：

- **控件绑定**: 将控件与DOM元素绑定
- **视图管理**: 管理控件的显示和交互

```typescript
class ControlView {
  constructor(el: HTMLElement, control: Control, nodeView: NodeView);
}
```

### 9. Utils (utils.ts)

工具函数模块，提供视图相关的辅助功能：

- **窗口事件监听**: 提供窗口事件监听和清理功能
- **DOM操作**: 提供DOM操作的辅助函数

## 交互功能

视图模块提供丰富的交互功能：

### 拖拽功能
- 节点拖拽移动
- 工作区平移
- 连接线拖拽创建

### 缩放功能
- 鼠标滚轮缩放
- 双击缩放
- 多点触控缩放

### 选择功能
- 单击选择节点
- Ctrl+单击多选节点
- 工作区点击取消选择

### 上下文菜单
- 节点右键菜单
- 工作区右键菜单

## 事件系统

视图模块通过事件系统与上层逻辑交互：

- **节点事件**: `nodetranslate`, `nodetranslated`, `selectnode`, `multiselectnode`
- **连接事件**: `renderconnection`, `updateconnection`
- **视图事件**: `rendernode`, `rendersocket`, `rendercontrol`
- **交互事件**: `click`, `contextmenu`, `mousemove`
- **变换事件**: `translate`, `translated`, `zoom`, `zoomed`

## 使用示例

```typescript
import { NodeEditor } from '../editor';
import { Component } from '../component';

// 创建编辑器视图
const container = document.getElementById('rete-container');
const editor = new NodeEditor('demo@1.0.0', container);

// 注册组件
editor.register(new MyComponent('MyNode'));

// 添加节点
const node = await MyComponent.createNode();
editor.addNode(node);

// 添加连接
editor.connect(output, input);
```

## 性能优化

视图模块通过以下方式优化性能：

- **事件节流**: 使用 `requestAnimationFrame` 优化视图更新
- **DOM复用**: 复用DOM元素减少创建开销
- **选择性更新**: 只更新需要更新的视图组件
- **事件委托**: 使用事件委托减少事件监听器数量