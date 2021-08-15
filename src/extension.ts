import * as vscode from 'vscode';
import { LessCommentProvider } from './utils/lessCommentProvider';

/**
 * vscode 启用插件会调用 activate 方法, 
 * 
 */
function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "less-complete" is now active!');
	const leeCommentProvider = new LessCommentProvider();
    let disposable = vscode.languages.registerCompletionItemProvider(
        'less',
        leeCommentProvider,
        '@' // 这里穿传入 @ 是 tigger 选项, 为了精确配置触发条件
    );
    
    context.subscriptions.push(disposable); // 完成订阅
};

/**
 * 销毁/禁用时调用 deactivate 方法
 */
function deactivate() {};

export {
    activate,
    deactivate
};