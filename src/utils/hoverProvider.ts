import * as vscode from 'vscode';
const path = require('path');
import { getFilePath, getFilePathContent } from './index';

/**
 * hover provider，匹配到了就return一个hover，否则不做处理
 * 效果：当前光标word，如果return了一个hover，word显示hover内容，否则无任何效果
 * @param {*} document
 * @param {*} position
 * @param {*} token
 */
class HoverProvider implements vscode.HoverProvider{
  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken):vscode.ProviderResult<vscode.Hover>{
      const fileName = document.fileName; // 当前文件名
      const workDir = path.dirname(fileName); //当前文件所在目录
      const word = document.getText(document.getWordRangeAtPosition(position));// 当前光标所在单词

      // todo: 根据光标关键词
      const filePathList = getFilePath(fileName, workDir);
      const list = getFilePathContent(filePathList);
      let result: any[] = [];
      // todo: 如果存在多个变量同命名？？
      // 那么就会得到多个变量定义内容,此种情况下，默认hover第一个定义
      list.filter( item => {
        return item.key === word;
      }).forEach( item => {
        result.push(
          {
            value: item.value,
            path: item.path
          }
        );
      });
      // hover内容支持markdown语法
      return new vscode.Hover(
        `* **变量值**：${result[0].value}\n* **变量来源**：${result[0].path}`
      );
  }
}

export {
  HoverProvider
};
