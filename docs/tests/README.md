# 测试模块 (Tests)

测试模块包含 Rete.js 框架的单元测试和集成测试，确保框架各部分功能的正确性和稳定性。

## 模块结构

```
test/
├── control.ts          # 控件相关测试
├── core.ts             # 核心模块测试
├── data/               # 测试数据
│   ├── add-numbers.js  # 加法运算测试数据
│   ├── components.ts   # 测试组件定义
│   └── recursive.js    # 递归测试数据
├── editor.ts           # 编辑器测试
├── engine.ts           # 引擎测试
├── socket.ts           # 插槽测试
├── utils/              # 测试工具
│   ├── render-mock.js  # 渲染模拟工具
│   └── throwsAsync.js  # 异步错误测试工具
└── validator.ts        # 验证器测试
```

## 详细说明

### 1. Editor 测试 (editor.ts)

`editor.ts` 文件测试编辑器的主要功能：

**测试范围**:
- 编辑器初始化和ID验证
- 组件注册和获取
- 节点管理（添加、删除、选择）
- 连接管理（创建、删除）
- 数据导入导出
- 事件处理和阻止

**关键测试用例**:
- `init`: 验证编辑器初始化和ID格式验证
- `component register`: 测试组件注册和获取功能
- `import/export`: 验证数据导入导出功能
- `connections`: 测试连接创建和删除
- `nodes`: 测试节点管理功能
- `prevent`: 测试事件阻止功能

```typescript
// 示例测试用例
it('connections', async () => {
    renderMock(editor);

    const node1 = await comps[0].createNode();
    const node2 = await comps[1].createNode();

    editor.addNode(node1);
    editor.addNode(node2);

    editor.connect(node1.outputs.get('num'), node2.inputs.get('num1'));
    assert.strictEqual(node1.outputs.get('num').connections.length, 1, 'one connection');

    var connection = node1.outputs.get('num').connections[0];

    assert.doesNotThrow(() => editor.removeConnection(connection), Error, 'remove connection');
    assert.strictEqual(node1.outputs.get('num').connections.length, 0, 'no connections');
});
```

### 2. Engine 测试 (engine.ts)

`engine.ts` 文件测试引擎模块的功能：

**测试范围**:
- 引擎初始化和克隆
- 组件注册
- 节点图执行
- 递归检测
- 错误处理
- 异常情况处理

**关键测试用例**:
- `init`: 引擎初始化测试
- `process`: 节点图执行测试
- `recursion`: 递归检测测试
- `error`: 错误处理测试

### 3. Core 测试 (core.ts)

`core.ts` 文件测试核心模块的功能：

**测试范围**:
- Context 类功能
- Emitter 事件系统
- Validator 数据验证
- 插件系统

**关键测试用例**:
- Context 初始化和插件管理
- 事件触发和监听
- 数据格式验证
- ID 格式验证

### 4. Socket 测试 (socket.ts)

`socket.ts` 文件测试插槽模块的功能：

**测试范围**:
- 插槽兼容性检查
- 插槽组合功能
- 连接验证

**关键测试用例**:
- 插槽兼容性验证
- 插槽组合测试
- 连接兼容性测试

### 5. Control 测试 (control.ts)

`control.ts` 文件测试控件模块的功能：

**测试范围**:
- 控件创建和管理
- 控件数据访问
- 控件节点关联

**关键测试用例**:
- 控件初始化
- 数据读写操作
- 节点访问验证

### 6. Validator 测试 (validator.ts)

`validator.ts` 文件测试验证器的功能：

**测试范围**:
- ID 格式验证
- 数据结构验证
- 版本匹配验证

**关键测试用例**:
- 有效ID格式验证
- 无效ID格式验证
- 数据结构验证

## 测试数据 (data/)

### 测试组件 (components.ts)

定义用于测试的模拟组件：

```typescript
// 示例测试组件
export class Comp1 extends Component {
  constructor() {
    super('Number');
  }

  async builder(node) {
    node.addInput(new Input('num', 'Number', new Socket('num')));
    node.addOutput(new Output('num', 'Number', new Socket('num')));
  }

  worker(node, inputs, outputs) {
    outputs['num'] = node.data && node.data['num'] || 1;
  }
}
```

### 测试数据集

- `add-numbers.js`: 加法运算的节点图数据
- `recursive.js`: 包含循环依赖的测试数据

## 测试工具 (utils/)

### Render Mock (render-mock.js)

提供渲染模拟功能，用于测试视图相关功能：

- 模拟节点渲染事件
- 提供渲染钩子函数
- 避免实际DOM操作的复杂性

### Throws Async (throwsAsync.js)

提供异步错误测试工具：

- 测试异步函数抛出的错误
- 验证错误类型和消息

## 测试策略

### 单元测试
- 对每个类和方法进行独立测试
- 验证边界条件和异常情况
- 测试私有方法的公共接口

### 集成测试
- 测试组件间的交互
- 验证完整的工作流程
- 模拟真实使用场景

### 覆盖率测试
- 使用 NYC 工具测量代码覆盖率
- 确保重要逻辑路径被测试覆盖
- 追求高测试覆盖率

## 测试运行

测试通过 Mocha 框架运行：

```bash
npm test
# 或
npm run coverage  # 包含覆盖率报告
```

## 测试特点

1. **全面性**: 覆盖框架的主要功能和边界情况
2. **模块化**: 按模块组织测试，便于维护
3. **模拟化**: 使用模拟对象避免外部依赖
4. **异步支持**: 支持异步操作的测试
5. **错误处理**: 包含错误情况的测试用例
6. **事件驱动**: 测试事件系统和响应机制

## 测试最佳实践

- 每个功能修改后运行测试
- 添加新功能时编写相应测试
- 维护高测试覆盖率
- 使用有意义的测试用例名称
- 测试边界条件和异常情况
- 保持测试的独立性和可重复性