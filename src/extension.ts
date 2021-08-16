import * as vscode from 'vscode';
import { CompletionProvider } from './utils/completionProvider';

/**
 * vscode 启用插件会调用 activate 方法,
 *
 */
function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "YPanaoid" is now active!');
	const completionProvider = new CompletionProvider();
    let disposable = vscode.languages.registerCompletionItemProvider(
        'less',
        completionProvider,
        '@'
    );

    context.subscriptions.push(disposable);
};

/**
 * 销毁/禁用时调用 deactivate 方法
 */
function deactivate() {};

export {
    activate,
    deactivate
};
