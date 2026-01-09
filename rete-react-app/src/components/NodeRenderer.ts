import { Node } from 'rete';

export const renderNode = (editor: any, node: Node) => {
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
};

export const renderConnection = (editor: any) => {
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