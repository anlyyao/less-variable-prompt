import * as vscode from 'vscode';
import path = require("path");
import fs = require("fs");

const getDirectoryFile = (config: { folderList: any[]; fileList: any[]; }, filePath: string) => {
  let fileList: string[] = [];
  const readDirSync = (config: any, path: fs.PathLike) => {
    // fs.readdirSync 指定目录下所有文件名称
    var pa = fs.readdirSync(path);
    let filesList = config.fileList;
    // console.log('==目录下所有文件==', pa);
    pa.forEach(function(element, index) {
      var info = fs.statSync(path + "/" + element);
      // 检查当前对象是否是文件夹
      if (info.isDirectory()) {
        // console.log("dir: " + element);
        // 如果当前路径为目录，递归
        readDirSync(config ,path + "/" + element);
      } else {
        // 如果当前已经是子文件，
        // todo: 判断文件名称是否为filesList中元素
        if(filesList.includes(element)){
          fileList.push(path + "/" + element);
        };
      }
    });
  };
  readDirSync(config, filePath);
  return fileList;
};

const getFoldersPath = (config: { folderList: any[]; fileList: any[] }, projectPath: string) => {
  try {
    let fileList: any[] = [];
    config.folderList.forEach(folder => {
      let realPath = path.join(projectPath, folder);
      console.log("读取文件夹：" + realPath);
      getDirectoryFile(config, realPath).forEach(file => {
        fileList.push(file);
      });
    });
    return fileList;
  } catch (e) {
    console.error("读取folderList失败，请检查package.json");
  }
};


const getDocumentWorkspaceFolder = (): string | undefined => {
  // vscode.window.activeTextEditor 表示当前被打开的文件路径
  const fileName = vscode.window.activeTextEditor?.document.fileName;
  // vscode.workspace.workspaceFolders可以获取当前工作区所有文件夹的根路径；
  return vscode.workspace.workspaceFolders
    ?.map((folder) => folder.uri.fsPath)
    .filter((fsPath) => fileName?.startsWith(fsPath))[0];
};

export {
  getFoldersPath,
  getDocumentWorkspaceFolder
};
