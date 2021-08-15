# less变量提示插件
# 使用方法
## 1 安装插件
## 2 使用插件。在项目根目录下的package.json中，另外声明一个lessProvider,给定folderList，和fileList。

### folderLis：相对于项目的文件夹路径
### fileList： 完整地文件名（需要加less后缀）
```
{
  "lessProvider": {
    "folderList": ["/src/common/src/style/", "/src/common/src/test/"],
    "fileList": ["index.less", "index2.less", "car.less"]
  }
}
```

## 3 效果
### 当在less文件中，光标前为 @ 时，给出less变量提示
