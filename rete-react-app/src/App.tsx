import React, { useEffect, useRef } from 'react';
import { NodeEditor } from 'rete';
import { NumberComponent } from './nodes/NumberNode';
import { AddComponent } from './nodes/AddNode';
import { NumberControlComponent } from './nodes/NumberControlNode';
import { StringComponent } from './nodes/StringNode';
import { HistoryPlugin } from './plugins/HistoryPlugin';
import { renderNode, renderConnection } from './components/NodeRenderer';

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
      editor.on('nodeselected', (node: any) => {
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

      // 应用节点和连接渲染
      renderNode(editor, numberNode);
      renderConnection(editor);
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