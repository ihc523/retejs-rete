import { Component, Node, Input, Output, Socket } from 'rete';

export class AddComponent extends Component {
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