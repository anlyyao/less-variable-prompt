import * as vscode from 'vscode';
import path = require("path");
import fs = require("fs");
import { getFilePath, getFilePathContent } from './index';


/**
 *  CompletionItemProvider 可以在用户键入字符之后提供可供选择的 item,
 *  用这个方法获取字符并匹配需要触发的点
 */
class CompletionProvider implements vscode.CompletionItemProvider{
    public provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
        const fileName = document.fileName;// 当前文件路径
        const workDir = path.dirname(fileName);// 当前文件所在目录
        // const line = document.lineAt(position);// 当前光标所在行
        const filePathList = getFilePath(fileName, workDir);
        const list = getFilePathContent(filePathList);

        var result: Array<any> = [];
        list.map( item => {
            let completionItems = new vscode.CompletionItem(
                item.key,
                vscode.CompletionItemKind.Variable  // vscode.CompletionItemKind 表示提示的类型
            );
            completionItems.detail = item.path;
            completionItems.documentation = new vscode.MarkdownString(
                item.value
            );
            result.push(completionItems) ;
        });
        return result;
    };

    public resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken): any{
        return item;
    }
}

export {
  CompletionProvider
};
