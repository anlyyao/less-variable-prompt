import * as vscode from 'vscode';
import { getFoldersPath, getDocumentWorkspaceFolder } from './index';
const path = require('path');

/**
 * 查找文件定义的provider，匹配到了就return一个location，否则不做处理
 * 最终效果是，当按住Ctrl键时，如果return了一个location，字符串就会变成一个可以点击的链接，否则无任何效果
 * @param {*} document
 * @param {*} position
 * @param {*} token
 */
 class GoDefinitionProvider implements vscode.DefinitionProvider {
  public provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken){

    const fileName = document.fileName;
    const workDir = path.dirname(fileName);
    const word = document.getText(document.getWordRangeAtPosition(position));
    const line = document.lineAt(position);
    const projectPath = getDocumentWorkspaceFolder();

    console.log('====== 进入 provideDefinition 方法 ======');
    console.log('fileName: ' + fileName); // 当前文件名
    console.log('workDir: ' + workDir); // 当前文件所在目录
    console.log('word: ' + word); // 当前光标所在单词
    console.log('line: ' + line.text); // 当前光标所在行
    console.log('projectPath: ' + projectPath); // 当前工程目录


    //todo: 获取光标单词所属文件，和文件中的行列位置
    // return new vscode.Location(vscode.Uri.file(这里是跳转的文件路径), new vscode.Position(跳转至第几行, 跳转至第几列));

    return new vscode.Location(vscode.Uri.file('/Users/dayao/Desktop/td-mini/tdesign-miniprogram/src/common/style/_variables.less'), new vscode.Position(0, 0));
  }
 }

export {
  GoDefinitionProvider
};
