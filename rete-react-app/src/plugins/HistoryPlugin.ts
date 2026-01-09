export interface EditorNode {
  id: number;
  name: string;
  data: any;
}

export class HistoryPlugin {
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