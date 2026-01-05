# Rete.js + React Demo

这是一个使用 Vite + React + Rete.js 构建的节点编辑器演示项目，基于 Rete.js 框架的示例代码构建。

## 项目结构

```
rete-react-app/
├── src/
│   ├── main.jsx      # React 入口文件
│   └── App.jsx       # 主应用组件，包含 Rete.js 编辑器
├── index.html        # HTML 入口文件
├── vite.config.js    # Vite 配置文件
├── package.json      # 项目配置文件
└── README.md         # 本说明文件
```

## 功能特性

- 基于 Rete.js 的节点编辑器
- 包含数字节点、加法节点和带控件的节点
- 自定义节点渲染样式
- 节点连接功能
- 数据导出功能

## 安装和运行

1. 确保你已安装 Node.js 环境

2. 安装依赖包：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 构建生产版本：
```bash
npm run build
```

## 示例说明

本项目实现了以下 Rete.js 示例功能：

1. **数字节点** - 输出一个数字值
2. **加法节点** - 接收两个输入并输出它们的和
3. **带控件的节点** - 可以通过输入框控制数值的节点

节点可以通过拖拽移动，连接线可以通过拖拽创建。点击"Export Data"按钮可以在控制台查看当前节点图的数据结构。

## 技术栈

- **Vite** - 构建工具
- **React** - UI 框架
- **Rete.js** - 节点编辑器框架