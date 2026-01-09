import { Component, Node, Input, Output, Socket } from 'rete';

export class StringComponent extends Component {
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