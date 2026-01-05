import React, { useEffect, useRef } from 'react';
import { NodeEditor, Component, Node, Input, Output, Socket, Control } from 'rete';

// 定义类型
interface NodeData {
  [key: string]: any;
}

interface EditorNode {
  id: number;
  name: string;
  data: NodeData;
}

// Number Component
class NumberComponent extends Component {
  constructor() {
    super('Number');
  }

  async builder(node: Node) {
    const socket = new Socket('Number socket');

    // 添加输出端口
    node.addOutput(new Output('num', 'Number', socket));
  }

  worker(node: any, inputs: any, outputs: any) {
    // 输出节点数据中的 'num' 值
    outputs['num'] = node.data && node.data['num'] || 0;
  }
}

// Add Component
class AddComponent extends Component {
  constructor() {
    super('Add');
  }

  async builder(node: Node) {
    const socket = new Socket('Number socket');

    // 添加两个输入端口
    node.addInput(new Input('num1', 'Number 1', socket));
    node.addInput(new Input('num2', 'Number 2', socket));
    
    // 添加输出端口
    node.addOutput(new Output('sum', 'Sum', socket));
  }

  worker(node: any, inputs: any, outputs: any) {
    // 获取两个输入的值并相加
    const n1 = inputs['num1'].length ? inputs['num1'][0] : 0;
    const n2 = inputs['num2'].length ? inputs['num2'][0] : 0;
    
    outputs['sum'] = n1 + n2;
  }
}

// Number Control Component
class NumberControlComponent extends Component {
  constructor() {
    super('Number Control');
  }

  async builder(node: Node) {
    const socket = new Socket('Number socket');

    // 添加输出端口
    node.addOutput(new Output('num', 'Number', socket));

    // 设置初始值
    node.data['num'] = node.data['num'] || 0;
  }

  worker(node: any, inputs: any, outputs: any) {
    outputs['num'] = node.data['num'];
  }
}

// String Component
class StringComponent extends Component {
  constructor() {
    super('String');
  }

  async builder(node: Node) {
    const socket = new Socket('String socket');
    node.addOutput(new Output('value', 'Value', socket));
  }

  worker(node: any, inputs: any, outputs: any) {
    outputs['value'] = node.data['value'] || '';
  }
}

// History Plugin
class HistoryPlugin {
  name: string;
  history: any[];
  index: number;
  editor: any;
  
  constructor() {
    this.name = 'history';
    this.history = [];
    this.index = -1;
  }

  install(editor: any, options: any) {
    this.editor = editor;
    
    // 监听重要事件以记录历史
    editor.on('nodecreated', (node: EditorNode) => {
      this.saveState('nodecreated', node);
    });
    
    editor.on('noderemoved', (node: EditorNode) => {
      this.saveState('noderemoved', node);
    });
    
    editor.on('connectioncreated', (connection: any) => {
      this.saveState('connectioncreated', connection);
    });
    
    editor.on('connectionremoved', (connection: any) => {
      this.saveState('connectionremoved', connection);
    });
    
    // 添加撤销/重做功能
    editor.undo = () => this.undo();
    editor.redo = () => this.redo();
  }

  saveState(action: string, data: any) {
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

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<NodeEditor | null>(null);

  useEffect(() => {
    const initEditor = async () => {
      if (!containerRef.current) return;
      
      // 初始化编辑器
      const editor = new NodeEditor('number-example@1.0.0', containerRef.current);
      editorRef.current = editor;

      // 注册组件
      editor.register(new NumberComponent());
      editor.register(new AddComponent());
      editor.register(new NumberControlComponent());
      editor.register(new StringComponent());

      // 使用历史插件
      editor.use(new HistoryPlugin());

      // 创建节点
      const numberNode = await (editor.getComponent('Number')).createNode({ num: 42 });
      numberNode.position = [200, 200];
      editor.addNode(numberNode);

      const addNode = await (editor.getComponent('Add')).createNode();
      addNode.position = [500, 200];
      editor.addNode(addNode);

      // 添加一个带控制的数字节点
      const controlNode = await (editor.getComponent('Number Control')).createNode({ num: 10 });
      controlNode.position = [200, 350];
      editor.addNode(controlNode);

      // 添加字符串节点
      const stringNode = await (editor.getComponent('String')).createNode({ value: 'Hello' });
      stringNode.position = [200, 500];
      editor.addNode(stringNode);

      // 监听节点选择事件
      editor.on('nodeselected', (node: Node) => {
        console.log('Node selected:', node.name);
      });

      // 监听连接创建事件
      editor.on('connectioncreated', (connection: any) => {
        console.log('Connection created');
      });

      // 监听连接创建前事件，用于验证
      editor.on('connectioncreate', ({ output, input }: { output: any, input: any }) => {
        console.log('Attempting to create connection:', output.node.name, '->', input.node.name);
        // 这里可以添加自定义验证逻辑
        return true; // 允许连接创建
      });

      // 监听工作区点击事件
      editor.on('click', (e: any) => {
        // 取消节点选择
        editor.selected.clear();
      });

      // 自定义节点渲染
      editor.on('rendernode', ({ el, node, component, bindSocket, bindControl }: any) => {
        // 创建自定义节点元素
        el.classList.add('custom-node');
        el.style.backgroundColor = '#f0f0f0';
        el.style.border = '2px solid #ccc';
        el.style.borderRadius = '8px';
        el.style.padding = '10px';
        el.style.minWidth = '120px';
        el.style.userSelect = 'none';

        // 创建标题
        const title = document.createElement('div');
        title.textContent = node.name;
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';
        el.appendChild(title);

        // 渲染输入端口
        node.inputs.forEach((input: any, key: string) => {
          const inputContainer = document.createElement('div');
          inputContainer.style.display = 'flex';
          inputContainer.style.alignItems = 'center';
          inputContainer.style.margin = '5px 0';

          const socketEl = document.createElement('div');
          socketEl.classList.add('input-socket');
          socketEl.textContent = input.name;
          socketEl.style.marginRight = '8px';
          socketEl.style.padding = '4px 8px';
          socketEl.style.border = '1px solid #999';
          socketEl.style.borderRadius = '4px';
          socketEl.style.backgroundColor = '#fff';
          socketEl.style.fontSize = '12px';
          
          bindSocket(socketEl, 'input', input);
          inputContainer.appendChild(socketEl);
          el.appendChild(inputContainer);
        });

        // 渲染输出端口
        node.outputs.forEach((output: any, key: string) => {
          const outputContainer = document.createElement('div');
          outputContainer.style.display = 'flex';
          outputContainer.style.alignItems = 'center';
          outputContainer.style.margin = '5px 0';

          const outputEl = document.createElement('div');
          outputEl.classList.add('output-socket');
          outputEl.textContent = output.name;
          outputEl.style.marginLeft = '8px';
          outputEl.style.padding = '4px 8px';
          outputEl.style.border = '1px solid #999';
          outputEl.style.borderRadius = '4px';
          outputEl.style.backgroundColor = '#fff';
          outputEl.style.fontSize = '12px';
          
          bindSocket(outputEl, 'output', output);
          outputContainer.appendChild(outputEl);
          el.appendChild(outputContainer);
        });

        // 添加数字输入控件
        if (node.name === 'Number Control') {
          const controlContainer = document.createElement('div');
          controlContainer.style.marginTop = '10px';
          
          const inputEl = document.createElement('input');
          inputEl.type = 'number';
          inputEl.value = node.data['num'] || 0;
          inputEl.style.width = '100%';
          inputEl.style.padding = '4px';
          
          inputEl.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const value = parseFloat(target.value) || 0;
            node.data['num'] = value;
          });
          
          controlContainer.appendChild(inputEl);
          el.appendChild(controlContainer);
        }
        
        // 添加字符串输入控件
        if (node.name === 'String') {
          const controlContainer = document.createElement('div');
          controlContainer.style.marginTop = '10px';
          
          const inputEl = document.createElement('input');
          inputEl.type = 'text';
          inputEl.value = node.data['value'] || '';
          inputEl.style.width = '100%';
          inputEl.style.padding = '4px';
          
          inputEl.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            node.data['value'] = target.value;
          });
          
          controlContainer.appendChild(inputEl);
          el.appendChild(controlContainer);
        }
      });
      
      // 自定义连接渲染
      editor.on('renderconnection', ({ el, connection, points }: any) => {
        el.style.backgroundColor = 'none';
        el.style.border = 'none';
        
        // 这里可以自定义连接线的渲染
        const [x1, y1, x2, y2] = points;
        
        // 创建 SVG 元素绘制连接线
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#999');
        line.setAttribute('stroke-width', '2');
        
        svg.appendChild(line);
        el.appendChild(svg);
      });
      
      // 更新连接
      editor.on('updateconnection', ({ el, connection, points }: any) => {
        const [x1, y1, x2, y2] = points;
        
        // 更新 SVG 线条
        const line = el.querySelector('line');
        if (line) {
          line.setAttribute('x1', x1);
          line.setAttribute('y1', y1);
          line.setAttribute('x2', x2);
          line.setAttribute('y2', y2);
        }
      });
    };

    initEditor();

    // 清理函数
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  const handleExecute = async () => {
    if (editorRef.current) {
      const data = editorRef.current.toJSON();
      console.log('Editor data:', JSON.stringify(data, null, 2));
      alert('Node graph data exported to console!');
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.clear();
    }
  };

  const handleUndo = () => {
    if (editorRef.current && (editorRef.current as any).undo) {
      (editorRef.current as any).undo();
    }
  };

  const handleRedo = () => {
    if (editorRef.current && (editorRef.current as any).redo) {
      (editorRef.current as any).redo();
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.2em' }}>Rete.js + React Demo</h1>
        <button onClick={handleExecute} style={{ padding: '5px 10px', fontSize: '0.9em' }}>
          Export Data
        </button>
        <button onClick={handleClear} style={{ padding: '5px 10px', fontSize: '0.9em' }}>
          Clear All
        </button>
        <button onClick={handleUndo} style={{ padding: '5px 10px', fontSize: '0.9em' }}>
          Undo
        </button>
        <button onClick={handleRedo} style={{ padding: '5px 10px', fontSize: '0.9em' }}>
          Redo
        </button>
      </header>
      <div 
        ref={containerRef} 
        style={{ 
          flex: 1, 
          backgroundColor: '#f8f8f8', 
          border: '1px solid #ccc',
          overflow: 'hidden'
        }}
      />
      <footer style={{ padding: '10px', backgroundColor: '#f0f0f0', fontSize: '0.8em', textAlign: 'center' }}>
        Drag nodes from the palette (not implemented in this demo), connect them, and click "Export Data" to see the graph data. 
        Use Undo/Redo buttons to test the history plugin.
      </footer>
    </div>
  );
}

export default App;