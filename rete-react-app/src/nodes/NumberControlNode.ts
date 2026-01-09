import { Component, Node, Input, Output, Socket } from 'rete';

export class NumberControlComponent extends Component {
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