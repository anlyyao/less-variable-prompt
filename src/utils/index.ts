import * as vscode from 'vscode';
import path = require("path");
import fs = require("fs");

const getDirectoryFile = (filePath: string) => {
  let fileList: string[] = [];
  const readDirSync = (path: fs.PathLike) => {
    var pa = fs.readdirSync(path);
    pa.forEach(function(ele, index) {
      var info = fs.statSync(path + "/" + ele);
      // 判断当前是否为目录
      if (info.isDirectory()) {
        // console.log("dir: " + ele);
        // 如果当前路径为目录，递归
        readDirSync(path + "/" + ele);
      } else {
        // 如果当前已经是子文件，判断后缀是否为 less
        if (ele.match(/^.+\.less/)) {
          // console.log("file: " + path + ele);
          fileList.push(path + "/" + ele);
        }
      }
    });
  };
  readDirSync(filePath);
  return fileList;
};

const getFoldersPath = (config: { folderList: any[]; }, projectPath: string) => {
  try {
    let fileList: any[] = [];
    config.folderList.forEach(folder => {
      let realPath = path.join(projectPath, folder);
      // console.log("读取文件夹：" + realPath);
      getDirectoryFile(realPath).forEach(file => {
        fileList.push(file);
      });
    });
    return fileList;
  } catch (e) {
    console.error("读取folderList失败，请检查csscpt.config.json");
  }
};


const getDocumentWorkspaceFolder = (): string | undefined => {
  const fileName = vscode.window.activeTextEditor?.document.fileName;
  // vscode.workspace.workspaceFolders可以获取当前工作区所有根文件夹数组；
  return vscode.workspace.workspaceFolders
    ?.map((folder) => folder.uri.fsPath)
    .filter((fsPath) => fileName?.startsWith(fsPath))[0];
};

export {
  getFoldersPath,
  getDocumentWorkspaceFolder
};
