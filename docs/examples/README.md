# 示例和用法

本节提供 Rete.js 框架的各种使用示例，从基础用法到高级功能。

## 基础示例

### 1. 简单数字节点

创建一个简单的数字输入节点：

```typescript
import { NodeEditor, Component, Node, Input, Output, Socket } from 'rete';

class NumberComponent extends Component {
  constructor() {
    super('Number');
  }

  async builder(node) {
    const socket = new Socket('Number socket');

    // 添加输出端口
    node.addOutput(new Output('num', 'Number', socket));
  }

  worker(node, inputs, outputs) {
    // 输出节点数据中的 'num' 值
    outputs['num'] = node.data && node.data['num'] || 0;
  }
}

// 初始化编辑器
const container = document.querySelector('#rete');
const editor = new NodeEditor('number-example@1.0.0', container);

// 注册组件
editor.register(new NumberComponent());

// 创建节点
const node = await (editor.getComponent('Number')).createNode({ num: 42 });
editor.addNode(node);
```

### 2. 加法节点

创建一个执行加法运算的节点：

```typescript
class AddComponent extends Component {
  constructor() {
    super('Add');
  }

  async builder(node) {
    const socket = new Socket('Number socket');

    // 添加两个输入端口
    node.addInput(new Input('num1', 'Number 1', socket));
    node.addInput(new Input('num2', 'Number 2', socket));
    
    // 添加输出端口
    node.addOutput(new Output('sum', 'Sum', socket));
  }

  worker(node, inputs, outputs) {
    // 获取两个输入的值并相加
    const n1 = inputs['num1'].length ? inputs['num1'][0] : 0;
    const n2 = inputs['num2'].length ? inputs['num2'][0] : 0;
    
    outputs['sum'] = n1 + n2;
  }
}

// 使用加法节点
editor.register(new AddComponent());
```

### 3. 带控件的节点

创建一个带有输入控件的节点：

```typescript
import { Control } from 'rete';

class NumberControl extends Control {
  constructor(emitter, key) {
    super(key);
    this.render = 'input';  // 使用输入框渲染
    this.template = '<input type="number" value="{{value}}" min="0" max="100">';

    // 监听值变化事件
    this.on('value', (value) => {
      this.putData('num', value);
    });
  }
}

class NumberControlComponent extends Component {
  constructor() {
    super('Number Control');
  }

  async builder(node) {
    const socket = new Socket('Number socket');
    const control = new NumberControl(this.editor, 'num');

    // 添加输出端口
    node.addOutput(new Output('num', 'Number', socket));
    // 添加控件
    node.addControl(control);

    // 设置初始值
    node.data['num'] = node.data['num'] || 0;
  }

  worker(node, inputs, outputs) {
    outputs['num'] = node.data['num'];
  }
}
```

## 高级示例

### 4. 自定义插槽类型

创建不同类型的插槽以实现类型安全连接：

```typescript
class TypeSafeExample {
  constructor() {
    // 定义不同类型的插槽
    this.numberSocket = new Socket('Number');
    this.stringSocket = new Socket('String');
    this.booleanSocket = new Socket('Boolean');
    
    // 使数字和字符串插槽兼容
    this.numberSocket.combineWith(this.stringSocket);
  }
  
  createNumberComponent() {
    return class NumberComponent extends Component {
      constructor() {
        super('Number');
      }

      async builder(node) {
        node.addOutput(new Output('value', 'Value', numberSocket));
      }

      worker(node, inputs, outputs) {
        outputs['value'] = node.data['value'] || 0;
      }
    }
  }
  
  createStringComponent() {
    return class StringComponent extends Component {
      constructor() {
        super('String');
      }

      async builder(node) {
        node.addOutput(new Output('value', 'Value', stringSocket));
      }

      worker(node, inputs, outputs) {
        outputs['value'] = node.data['value'] || '';
      }
    }
  }
}
```

### 5. 节点连接验证

实现自定义连接验证逻辑：

```typescript
class ValidatedConnectionComponent extends Component {
  constructor() {
    super('Validated Connection');
  }

  async builder(node) {
    const inputSocket = new Socket('Input');
    const outputSocket = new Socket('Output');

    node.addInput(new Input('input', 'Input', inputSocket));
    node.addOutput(new Output('output', 'Output', outputSocket));
  }

  worker(node, inputs, outputs) {
    // 验证输入数据
    if (inputs['input'] && inputs['input'][0] !== undefined) {
      outputs['output'] = inputs['input'][0];
    } else {
      outputs['output'] = null;
    }
  }
}

// 在编辑器中监听连接创建事件以进行验证
editor.on('connectioncreate', ({ output, input }) => {
  // 自定义验证逻辑
  if (someValidationCondition) {
    return false; // 阻止连接创建
  }
  return true; // 允许连接创建
});
```

### 6. 复杂工作流

创建一个复杂的工作流示例：

```typescript
class WorkflowExample {
  constructor() {
    this.editor = new NodeEditor('workflow@1.0.0', document.querySelector('#rete'));
    
    // 注册所有组件
    this.registerComponents();
  }

  registerComponents() {
    // 数据源节点
    this.editor.register(new DataSourceComponent());
    
    // 处理节点
    this.editor.register(new ProcessComponent());
    
    // 过滤节点
    this.editor.register(new FilterComponent());
    
    // 输出节点
    this.editor.register(new OutputComponent());
  }

  async createWorkflow() {
    // 创建节点
    const sourceNode = await this.editor.getComponent('DataSource').createNode();
    const processNode = await this.editor.getComponent('Process').createNode();
    const filterNode = await this.editor.getComponent('Filter').createNode();
    const outputNode = await this.editor.getComponent('Output').createNode();

    // 添加到编辑器
    this.editor.addNode(sourceNode);
    this.editor.addNode(processNode);
    this.editor.addNode(filterNode);
    this.editor.addNode(outputNode);

    // 创建连接
    this.editor.connect(sourceNode.outputs.get('data'), processNode.inputs.get('input'));
    this.editor.connect(processNode.outputs.get('processed'), filterNode.inputs.get('data'));
    this.editor.connect(filterNode.outputs.get('filtered'), outputNode.inputs.get('input'));
  }
}
```

## 引擎执行示例

### 7. 节点图执行

使用引擎执行节点图：

```typescript
import { Engine } from 'rete';

class ExecutionExample {
  constructor() {
    this.engine = new Engine('execution@1.0.0');
    
    // 注册与编辑器相同的组件
    this.engine.register(new NumberComponent());
    this.engine.register(new AddComponent());
  }

  async executeGraph() {
    // 获取编辑器的数据
    const data = editor.toJSON();
    
    // 执行节点图
    const result = await this.engine.process(data);
    
    if (result === 'success') {
      console.log('Execution completed successfully');
    } else {
      console.log('Execution was aborted');
    }
  }
}
```

## 自定义视图示例

### 8. 自定义节点渲染

自定义节点的外观和行为：

```typescript
// 监听节点渲染事件
editor.on('rendernode', ({ el, node, component, bindSocket, bindControl }) => {
  // 创建自定义节点元素
  el.classList.add('custom-node');
  el.style.backgroundColor = '#f0f0f0';
  el.style.border = '2px solid #ccc';
  el.style.borderRadius = '8px';
  el.style.padding = '10px';

  // 创建标题
  const title = document.createElement('div');
  title.textContent = node.name;
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '10px';
  el.appendChild(title);

  // 渲染输入端口
  node.inputs.forEach((input, key) => {
    const inputEl = document.createElement('div');
    inputEl.classList.add('input-socket');
    inputEl.textContent = input.name;
    inputEl.style.margin = '5px 0';
    inputEl.style.padding = '4px';
    inputEl.style.border = '1px solid #999';
    inputEl.style.borderRadius = '4px';
    inputEl.style.display = 'inline-block';
    
    bindSocket(inputEl, 'input', input);
    el.appendChild(inputEl);
  });

  // 渲染输出端口
  node.outputs.forEach((output, key) => {
    const outputEl = document.createElement('div');
    outputEl.classList.add('output-socket');
    outputEl.textContent = output.name;
    outputEl.style.margin = '5px 0';
    outputEl.style.padding = '4px';
    outputEl.style.border = '1px solid #999';
    outputEl.style.borderRadius = '4px';
    outputEl.style.display = 'inline-block';
    
    bindSocket(outputEl, 'output', output);
    el.appendChild(outputEl);
  });
});
```

## 插件示例

### 9. 自定义插件

创建一个简单的插件：

```typescript
class HistoryPlugin {
  constructor() {
    this.name = 'history';
    this.history = [];
    this.index = -1;
  }

  install(editor, options) {
    this.editor = editor;
    
    // 监听重要事件以记录历史
    editor.on('nodecreated', (node) => {
      this.saveState('nodecreated', node);
    });
    
    editor.on('noderemoved', (node) => {
      this.saveState('noderemoved', node);
    });
    
    editor.on('connectioncreated', (connection) => {
      this.saveState('connectioncreated', connection);
    });
    
    editor.on('connectionremoved', (connection) => {
      this.saveState('connectionremoved', connection);
    });
    
    // 添加撤销/重做功能
    editor.undo = () => this.undo();
    editor.redo = () => this.redo();
  }

  saveState(action, data) {
    // 保存当前状态到历史记录
    this.history = this.history.slice(0, this.index + 1);
    this.history.push({ action, data, timestamp: Date.now() });
    this.index = this.history.length - 1;
  }

  undo() {
    if (this.index <= 0) return false;
    
    const state = this.history[--this.index];
    // 实现撤销逻辑
    console.log('Undo:', state);
    return true;
  }

  redo() {
    if (this.index >= this.history.length - 1) return false;
    
    const state = this.history[++this.index];
    // 实现重做逻辑
    console.log('Redo:', state);
    return true;
  }
}

// 使用插件
editor.use(new HistoryPlugin());
```

## 实际应用示例

### 10. 完整的应用示例

一个完整的节点编辑器应用：

```typescript
class NodeEditorApp {
  constructor(containerId) {
    this.container = document.querySelector(containerId);
    this.editor = new NodeEditor('app@1.0.0', this.container);
    this.engine = new Engine('app@1.0.0');
    
    this.init();
  }

  init() {
    this.registerComponents();
    this.setupEventHandlers();
    this.setupUI();
  }

  registerComponents() {
    // 注册所有需要的组件
    const components = [
      new NumberComponent(),
      new AddComponent(),
      new SubtractComponent(),
      new MultiplyComponent(),
      new OutputComponent()
    ];

    components.forEach(component => {
      this.editor.register(component);
      this.engine.register(component);
    });
  }

  setupEventHandlers() {
    // 节点选择事件
    this.editor.on('nodeselected', (node) => {
      console.log('Node selected:', node.name);
    });

    // 连接创建事件
    this.editor.on('connectioncreated', (connection) => {
      console.log('Connection created');
    });

    // 工作区点击事件
    this.editor.on('click', (e) => {
      // 取消节点选择
      this.editor.selected.clear();
    });
  }

  setupUI() {
    // 添加执行按钮
    const executeBtn = document.createElement('button');
    executeBtn.textContent = 'Execute';
    executeBtn.onclick = () => this.execute();
    document.body.appendChild(executeBtn);

    // 添加保存/加载按钮
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.onclick = () => this.save();
    document.body.appendChild(saveBtn);
  }

  async execute() {
    const data = this.editor.toJSON();
    const result = await this.engine.process(data);
    console.log('Execution result:', result);
  }

  save() {
    const data = this.editor.toJSON();
    localStorage.setItem('rete-data', JSON.stringify(data));
    console.log('Data saved');
  }

  load() {
    const dataStr = localStorage.getItem('rete-data');
    if (dataStr) {
      const data = JSON.parse(dataStr);
      this.editor.fromJSON(data);
    }
  }
}

// 初始化应用
const app = new NodeEditorApp('#rete-container');
```

## 最佳实践

### 11. 性能优化

```typescript
// 优化大量节点的渲染
class OptimizedNodeComponent extends Component {
  async builder(node) {
    // 使用虚拟化技术或分页加载大量节点
    const socket = new Socket('Data');
    
    // 仅在需要时创建复杂的UI元素
    node.addInput(new Input('input', 'Input', socket));
    node.addOutput(new Output('output', 'Output', socket));
  }

  worker(node, inputs, outputs) {
    // 优化工作函数的执行效率
    const startTime = performance.now();
    
    // 执行节点工作逻辑
    outputs['output'] = this.processData(inputs);
    
    const endTime = performance.now();
    console.log(`Node ${node.id} processed in ${endTime - startTime}ms`);
  }

  processData(inputs) {
    // 实现高效的数据处理逻辑
    return inputs['input'][0] || null;
  }
}
```

这些示例展示了 Rete.js 框架的各种使用方式，从基础的节点创建到复杂的自定义功能实现。可以根据具体需求选择合适的示例作为起点进行开发。