import * as vscode from 'vscode';
import { CompletionProvider } from './utils/completionProvider';
import { DefinitionProvider } from './utils/definitionProvider';
import { HoverProvider } from './utils/hoverProvider';
/**
 * vscode 启用插件会调用 activate 方法,
 *
 */
function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "YPanaoid" is now active!');

    // 注册： less变量提示
    const completionProvider = new CompletionProvider();
    let disposable = vscode.languages.registerCompletionItemProvider(
        'less',
        completionProvider,
        '@' // 这里穿传入 @ 是 tigger 选项, 为了精确配置触发条件
    );
    context.subscriptions.push(disposable);

    // 注册 跳转到定义
    const linkDefinitionProvider = new DefinitionProvider();
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(
      'less',
      linkDefinitionProvider
    ));

    // 注册 hover
    const showHoverProvider = new HoverProvider();
    context.subscriptions.push(vscode.languages.registerHoverProvider(
      'less',
      showHoverProvider
    ));
};

/**
 * 销毁/禁用时调用 deactivate 方法
 */
function deactivate() {};

export {
    activate,
    deactivate
};
