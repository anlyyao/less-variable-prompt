import * as vscode from 'vscode';
const path = require('path');
class GoHoverProvider implements vscode.HoverProvider{
  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken):vscode.ProviderResult<vscode.Hover>{
      const fileName    = document.fileName; // 当前文件名
      const workDir     = path.dirname(fileName); //当前文件所在目录
      const word        = document.getText(document.getWordRangeAtPosition(position));// 当前光标所在单词
      console.log('===', fileName, workDir, word);
      // todo: 获取单词描述
      return new vscode.Hover('i an a hover');
  }
}

export {
  GoHoverProvider
};
