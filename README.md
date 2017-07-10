# HG-admin

管理后台项目。

## 需求
- 开发配置管理

- 部门会议管理

- 部门人事管理

后台： `hack.cannot.cc/ap1/v1`
配置后台接口：`./src/components/common/request/cc_request.js`

## 功能实现
- [x] 登录： 实现跳转和部分前端规则验证，未发起正确性验证。
- [x] 配置管理（树状图控件） 下一步：实现组件间数据传递，以查看详情
- [ ] Markdown显示： [VueMarkdown](https://github.com/miaolz123/vue-markdown)
- [ ] Markdown编辑器： [MarkdownEditor](https://github.com/alecgorge/MarkdownEditor)&amp[Vue-SimpleMDE](https://github.com/F-loat/vue-simplemde)
- [ ] 富文本框： [quillEditor](https://github.com/surmon-china/vue-quill-editor)
- [ ] 图表： [百度Echarts](http://echarts.baidu.com)&amp;[Vue-Echarts](https://github.com/xlsdg/vue-echarts-v3)
- [ ] 文件上传： [使用iView自带的文件上传组件](https://www.iviewui.com/components/upload)


## 目前用到的组件
- [x] iView： [iView2.0](https://github.com/iview/iview)
- [x] Vuex： [Vuex2.x](http://vuex.vuejs.org/zh-cn/intro.html)
- [x] vue-localstorage: [vue-localStorage](https://www.npmjs.com/package/vue-localstorage)
- [x] vue-datatable: `npm install --save vue-datatable`

# 引用
- [localstorage](https://www.npmjs.com/package/vue-localstorage)
- [vuex]()
- [A acceptable Login-Setup module](https://auth0.com/blog/build-an-app-with-vuejs/)
- [Vue 2.0 起步(3) 数据流vuex和LocalStorage实例 ](http://www.jianshu.com/p/fb758398268a)   





### Install
```bush
// install dependencies
npm install
```
### Run
#### Development
```bush
npm run dev
```
#### Production(Build)
```bush
npm run build
```

