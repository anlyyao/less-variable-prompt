import * as vscode from 'vscode';
import path = require("path");
import fs = require("fs");
import readline = require('readline');
import { getFoldersPath, getDocumentWorkspaceFolder } from './index';


/**
 *  CompletionItemProvider 可以在用户键入字符之后提供可供选择的 item,
 *  用这个方法获取字符并匹配需要触发的点
 */
class LessCommentProvider implements vscode.CompletionItemProvider{
    public provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
        // lineAt(position: Position): TextLine; 根据一个位置返回这一行的行对象
        const line = document.lineAt(position);
        // 获取项目根目录
        const currentWorkspaceFolders = String(getDocumentWorkspaceFolder());
        const projectPath = currentWorkspaceFolders;

        // 只截取到光标位置为止，防止一些特殊情况
        const lineText = line.text.substring(0, position.character);
        if((/[\@]+$/g).test(lineText)){ // 判断光标的前一个字符是否为‘@’, true 则添加代码提示
        // if(lineText.slice(-1) === '@') {
            try {
                // 获取csscpt.config.json中的相关配置
                let config = JSON.parse(
                    fs.readFileSync(path.join(projectPath, "package.json"), "utf-8")
                ).lessProvider;
                try {
                    let fileListPath: any[] = [], arr: any =[], arr1: any =[];;
                    // folder
                    if (config.folderList) {
                        arr = getFoldersPath(config, projectPath);
                    }
                    fileListPath = Array.from(new Set(fileListPath.concat(arr, arr1)));
                    let list: any[] = [];
                    let reg = /(\/\/.*)|(\/\*[\s\S]*?\*\/)|(\r\n\t|\n|\r\t)/g; // 去文件中的空行、注释等
                    fileListPath.forEach( path => {
                        let fileContentList = fs
                            .readFileSync(path, "utf-8")
                            .replace(reg, "")
                            .split(";");
                        let contentList: {
                            content: string;
                            path: any;
                        }[] = [];
                        fileContentList.forEach(item => {
                            contentList.push({
                                content: item.trim(), //去空格
                                path
                            });
                        });
                        list = Array.from(new Set(list.concat(contentList)));
                    });
                    var result: Array<any> = [];
                    list.map( item => {
                        let arrContent = item.content.split(":");
                        let key = arrContent[0], value = arrContent[1];
                        let completionItems = new vscode.CompletionItem(
                            key,
                            vscode.CompletionItemKind.Variable  // vscode.CompletionItemKind 表示提示的类型
                        );
                        completionItems.detail = item.path;
                        completionItems.documentation = new vscode.MarkdownString(
                            key + ":" + value
                        );
                        result.push(completionItems) ;
                    });
                    return result;
                } catch(err) {
                    console.log('变量定义文件读取失败~~');
                    console.log(err);
                }
            } catch(e) {
                console.error("package.json文件读取失败",e);
            }
        }
    };

    public resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken): any{
        return item;
    }
}

export {
    LessCommentProvider
};
