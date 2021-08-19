import * as vscode from 'vscode';
/**
 * vscode 启用插件会调用 activate 方法,
 *
 */
function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "less-variable-prompt" is now active!');
    require("./utils/completionProvider")(context); // less变量提示
    require("./utils/definitionProvider")(context); // 跳转定义
    require("./utils/hoverProvider")(context); // 悬停提示
};

/**
 * 销毁/禁用时调用 deactivate 方法
 */
function deactivate() {};

export {
    activate,
    deactivate
};
