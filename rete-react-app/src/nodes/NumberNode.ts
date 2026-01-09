import { Component, Node, Input, Output, Socket } from 'rete';

export class NumberComponent extends Component {
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