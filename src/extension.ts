import * as vscode from 'vscode';
import { CompletionProvider } from './utils/completionProvider';
import { GoDefinitionProvider } from './utils/definitionProvider';
import { GoHoverProvider } from './utils/hoverProvider';
/**
 * vscode 启用插件会调用 activate 方法,
 * 插件被激活时触发，所有代码总入口
 * @param {*} context 插件上下文
 */
function activate(context: vscode.ExtensionContext) {
  console.log('恭喜，您的扩展“YPanaoid plugin”已被激活！');

  // 注册 代码提示
	const completionProvider= new CompletionProvider();
  let disposable = vscode.languages.registerCompletionItemProvider(
      'less',
      completionProvider,
      '@' // 这里穿传入 @ 是 tigger 选项, 为了精确配置触发条件
  );
  context.subscriptions.push(disposable); // 完成订阅

  // 注册 跳转到定义
  const goDefinitionProvider = new GoDefinitionProvider();
  context.subscriptions.push(vscode.languages.registerDefinitionProvider(
    'less',
    goDefinitionProvider
  ));

  // 注册 hover
  const goHoverProvider = new GoHoverProvider();
  context.subscriptions.push(vscode.languages.registerHoverProvider(
    'less',
    goHoverProvider
  ));
};

/**
 * 销毁/禁用时调用 deactivate 方法
 */
function deactivate() {
  console.log('您的扩展“YPanaoid plugin”已被释放！');
};

export {
    activate,
    deactivate
};
