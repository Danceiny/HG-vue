# iView-admin

管理后台项目。

## 需求
- 配置管理系统

- 题库管理系统

# 配置管理系统
## 组件

- 主页：src/components/page/Config/manager.vue
- 详情页：src/components/page/Config/detail.vue
- 修改页：src/components/page/Config/modify.vue
>都是 src/components/common/index.vue的子组件。

- 主页向服务器请求数据地址【GET】： ip:port/getconfig
- 详情页向服务器请求数据地址【GET】: ip:port/getconfig?id=ID
- 修改页向服务器请求数据地址【POST】： ip:port/config?id=ID

设计流程：
1. 主页向服务器发起全部配置请求 ->
1. 拿到data后渲染Tree -> 
2. 获取选中节点 -> 
3. 将所选节点存到vuex -> 
4. 获取选中点击事件跳转到详情页 -> 
5. 详情页从vuex中拿到id -> 
6. 详情页通过id向服务器发起详情请求 ->
7. 详情页拿到data渲染Table，并存储data到vuex中 ->
8. 详情页通过获取修改点击事件跳转到修改页 ->
9. 修改页从vuex中拿到data并渲染Form，通过POST向服务器提交修改。

【注】vuex / localStorage 都还不熟，可选项。vuex偏向state管理，这里应更偏向localstorage。好像vue还专门有个localStorage。

# 题库管理系统
- [ ] 题库上传编辑工具： 使用考试星，暂停自主开发。

# 目前实现的功能
- [x] 登录： 实现跳转和部分前端规则验证，未发起正确性验证。
- [x] 配置管理（树状图控件） 下一步：实现组件间数据传递，以查看详情
- [ ] Markdown显示： [VueMarkdown](https://github.com/miaolz123/vue-markdown)
- [ ] Markdown编辑器： [MarkdownEditor](https://github.com/alecgorge/MarkdownEditor)&amp[Vue-SimpleMDE](https://github.com/F-loat/vue-simplemde)
- [ ] 富文本框： [quillEditor](https://github.com/surmon-china/vue-quill-editor)
- [ ] 图表： [百度Echarts](http://echarts.baidu.com)&amp;[Vue-Echarts](https://github.com/xlsdg/vue-echarts-v3)
- [ ] 文件上传： [使用iView自带的文件上传组件](https://www.iviewui.com/components/upload)


# 目前用到的组件
- [x] iView： [iView2.0](https://github.com/iview/iview)
- [x] Vuex： [Vuex2.x](http://vuex.vuejs.org/zh-cn/intro.html)
- [x] vue-localstorage: [vue-localStorage](https://www.npmjs.com/package/vue-localstorage)


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
// For the first time, run init to create index.html
npm run init
npm run dev
```
#### Production(Build)
```bush
npm run build
```

