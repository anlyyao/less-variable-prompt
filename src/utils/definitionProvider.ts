import * as vscode from 'vscode';
import { getFilePath, getFilePathContent } from './index';
import fs = require("fs");
import readline = require('readline');
import path = require('path');

/**
 * 查找文件定义的provider，匹配到了就return一个location，否则不做任何处理
 * 效果: 按住Ctrl键时，如果当前word拥有location，字符串就会变成一个可以点击的链接，否则无任何效果
 * @param {*} document
 * @param {*} position
 * @param {*} token
 */

 class DefinitionProvider implements vscode.DefinitionProvider {
  public provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location> {

    const fileName = document.fileName;
    const workDir = path.dirname(fileName);
    const word = document.getText(document.getWordRangeAtPosition(position));

    //todo: 获取光标关键词所属文件，和文件中的行列位置
    const filePathList = getFilePath(fileName, workDir);
    const list = getFilePathContent(filePathList);

    let result: string[] = [];
    // todo: 如果存在多个变量同命名？？
    // 那么就会得到多个变量定义文件地址,此种情况下，目前默认跳第一个定义
    list.filter( item => {
      return item.key === word;
    }).forEach( item => {
      result.push(item.path) ;
    });

    // result[0]为变量来源地址，读取该文件，判断光标word所处行
    const lineList = fs.readFileSync(result[0]).toString('utf8').split('\n');
    let reg = /(\/\*[\s\S]*?\*\/)|(\{[^\}]+\})|(@import.*)|(\/\/.*)/g; // 去文件中的import、注释、{}、.开头的等
    const lineTarget =lineList.findIndex((value)=> value.replace(reg, "").split(":")[0]=== word);

    return new vscode.Location(
      vscode.Uri.file(result[0]),
      new vscode.Position(lineTarget, 0)
    );
  };
}

export {
  DefinitionProvider
};
