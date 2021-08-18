import * as vscode from 'vscode';
import path = require("path");
import fs = require("fs");

const getFilePath = (fileName: string, workDir: string) => {
  let filePathList: string[] = [];
  // filePathList.push(fileName);
  // 读取当前less文件，分析@import导入情况
  function getFileSrc(fileName: string, workDir: string){
    const regImport = /@import.*/g; // 匹配@import
    const regQuote = /('|")(.*?)\1/g; // 匹配单引号双引号中间的内容
    const regAnnotation = /(\/\/.*)|(\/\*[\s\S]*?\*\/)/g; // 去注释
    filePathList.push(fileName);
    const lessContent = fs.readFileSync(fileName, 'utf-8').replace(regAnnotation, '');
    // 判断当前是否有 @import
    if(lessContent && new RegExp('@import').test(lessContent)){
      const regList =Array.from(new Set(lessContent.match(regImport))) ;
      regList?.forEach( item => {
        const listItem: string[] | null = item.match(regQuote);
        const srcRelative = listItem? listItem[0].substring(1, listItem[0].length - 1): '';
        const srcAbsolute = path.join(workDir, srcRelative);
        // todo: 判断每一个@import文件中是否还包含 import语句，如果有，递归寻找，直到子文件中不再有@import文件
        // 注意这里workDir已经发生改变，为srcAbsolute路径去掉文件名称
        const temp =srcAbsolute.substring(0, srcAbsolute.lastIndexOf('/'));
        getFileSrc(srcAbsolute, temp);
      });
    }
  }
  getFileSrc( fileName, workDir);
  filePathList = Array.from(new Set(filePathList));
  return filePathList;
};

const getFilePathContent = (fileListPath: string[]) => {
  let list: any[] = [];
  let reg = /(\/\*[\s\S]*?\*\/)|(\{[^\}]+\})|(@import.*)|(\/\/.*)|(\r\n\t|\n|\r\t)/g; // 去文件中的import、注释、{}、.开头的、空行等
  fileListPath.forEach( path => {
    let fileContentList = fs
        .readFileSync(path, "utf-8")
        .replace(reg, "")
        .split(";");
    let contentList: {
        key: string;
        value: string;
        path: string;
    }[] = [];

    fileContentList.forEach(item => {
      let value = item.trim();
      let key = value.split(':')[0];
      contentList.push({
        key,
        value,
        path
      });
    });
    list = Array.from(new Set(list.concat(contentList)));
  });
  // todo: 匹配less中的变量，(即去除less文件中的class类，只留下@varible变量)
  const result = list.filter( item => {
    const reg = /^@/;
    return reg.exec(item.key);
  });
  return Array.from(new Set(result));
};

const getProjectPath = (): string | undefined => {
  // vscode.window.activeTextEditor 表示当前被打开的文件路径
  const fileName = vscode.window.activeTextEditor?.document.fileName;
  // vscode.workspace.workspaceFolders可以获取当前工作区所有文件夹的根路径；
  return vscode.workspace.workspaceFolders
    ?.map((folder) => folder.uri.fsPath)
    .filter((fsPath) => fileName?.startsWith(fsPath))[0];
};

export {
  getFilePath, // 获取当前less文件相关@import文件的绝对地址
  getFilePathContent, // 根据绝对地址，处理less文件，获取less变量
  getProjectPath, //获取工程目录
};
