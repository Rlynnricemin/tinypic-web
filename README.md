# Tinypic—— 图片压缩工具
A small library for compress the image
web 图片压缩插件，支持png与jpg格式的图片压缩，配置限制上传的图片大小，可获得File或者base64格式的图片

PreView
--------------------------------------
<div align=center><img src="https://rlynnricemin.github.io/tinypic-web/example/viewpic.png" width="300" alt="demo"/></div>

Demo
--------------------------------------
[demo page](https://rlynnricemin.github.io/tinypic-web/example/index.html)

Install
--------------------------------------

```
npm install tinypic-web --save
```
How to Use
--------------------------------------
```
new TinyPic({
  file: new File(),
  type: 'file', // file or base64
  limitsize: 100 * 1024, // 允许上传的文件大小
  callback: function(file) {
    return file
  }
})
```