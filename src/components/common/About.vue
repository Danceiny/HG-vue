<!--<style scoped>-->

<!--.about {-->
  <!--margin: 10px 20px 0 30px;-->
  <!--color: black;-->
<!--}-->

<!--</style>-->

<!--<template>-->

<!--<div class="about">-->
    <!--<vue-markdown># 后台管理系统</vue-markdown>-->
    <!--<vue-markdown>-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;</vue-markdown>-->
    <!--<vue-markdown>### 基于Vue2 + iView2.0 </vue-markdown>-->
    <!--<br/><br/>-->
    <!--<vue-markdown># 自述</vue-markdown>-->
    <!--<vue-markdown>-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;</vue-markdown>-->
    <!--<vue-markdown>### iView 是一套高效美观的 Vue2 UI 框架。主要适合大中型中后台产品，比如某产品的运营平台、数据监控平台、管理平台等，从工程配置、到样式布局，甚至后面规划的业务套件，是一整套的解决方案，十分适合快速开发。-->
    <!--</vue-markdown>-->
    <!--<vue-markdown>### 之前用过Element UI（Vue2）和iView1.0，深深感觉到此类UI的方便快捷性；对于我个人来说，最主要的是，可以把主要精力转移到前端数据及逻辑上。</vue-markdown>-->
    <!--<vue-markdown>### 最近iView发布了针对Vue2的2.0版本，于是我出于学习的目的，完成了这样一个简单的后台管理系统的示例。</vue-markdown>-->
    <!--<br/><br/>-->
    <!--<vue-markdown># 目前实现的功能及用到的组件</vue-markdown>-->
    <!--<vue-markdown>-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;</vue-markdown>-->
    <!--<vue-markdown>### 页面： [iView2.0](https://github.com/iview/iview)</vue-markdown>-->
    <!--<vue-markdown>### Markdown显示： [VueMarkdown](https://github.com/miaolz123/vue-markdown)</vue-markdown>-->
    <!--<vue-markdown>### Markdown编辑器： [MarkdownEditor](https://github.com/alecgorge/MarkdownEditor)&amp[Vue-SimpleMDE](https://github.com/F-loat/vue-simplemde)</vue-markdown>-->
    <!--<vue-markdown>### 富文本框： [quillEditor](https://github.com/surmon-china/vue-quill-editor)</vue-markdown>-->
    <!--<vue-markdown>### 图表： [百度Echarts](http://echarts.baidu.com)&amp[Vue-Echarts](https://github.com/xlsdg/vue-echarts-v3)</vue-markdown>-->
    <!--<vue-markdown>### 文件上传： [使用iView自带的文件上传组件](https://www.iviewui.com/components/upload)</vue-markdown>-->
    <!--<br/><br/>-->
    <!--<vue-markdown># 其他</vue-markdown>-->
    <!--<vue-markdown>-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;</vue-markdown>-->
    <!--<vue-markdown>### 如无特殊情况，本项目会持续维护</vue-markdown>-->
<!--</div>-->

<!--</template>-->

<!--<script>-->

<!--import VueMarkdown from 'vue-markdown'-->
<!--export default {-->
    <!--components: {-->
        <!--VueMarkdown-->
    <!--}-->
<!--}-->

<!--</script>-->


<template>
    <div>
        <div class="crumbs">
            <Breadcrumb separator="/">
                <Breadcrumb-item><i class="el-icon-setting"></i> 自述</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="ms-doc">
            <h3>README.md</h3>
            <article>
                <h1>manage-system</h1>
                <p>基于Vue.js 2.x系列 + Element UI 的后台管理系统解决方案</p>
                <h2>前言</h2>
                <p>中國電子商務師官網後台管理</p>
                <!--<p>之前在公司用了Vue + Element组件库做了个后台管理系统，基本很多组件可以直接引用组件库的，但是也有一些需求无法满足。像图片裁剪上传、富文本编辑器、图表等这些在后台管理系统中很常见的功能，就需要引用其他的组件才能完成。从寻找组件，到使用组件的过程中，遇到了很多问题，也积累了宝贵的经验。所以我就把开发这个后台管理系统的经验，总结成这个后台管理系统解决方案。</p>-->
                <!--<p>该方案作为一套多功能的后台框架模板，适用于绝大部分的后台管理系统（Web Management System）开发。基于vue.js,使用vue-cli脚手架快速生成项目目录，引用Element UI组件库，方便开发快速简洁好看的组件。分离颜色样式，支持手动切换主题色，而且很方便使用自定义主题色。</p>-->
                <!--<h2>功能</h2>-->
                <Checkbox disabled checked>Element UI</Checkbox>
                <br>
                <Checkbox disabled checked>登录/注销</Checkbox>
                <br>
                <Checkbox disabled checked>表格</Checkbox>
                <br>
                <Checkbox disabled checked>表单</Checkbox>
                <br>
                <Checkbox disabled checked>图表</Checkbox>
                <br>
                <Checkbox disabled checked>富文本编辑器</Checkbox>
                <br>
                <Checkbox disabled checked>markdown编辑器</Checkbox>
                <br>
                <Checkbox disabled checked>图片拖拽/裁剪上传</Checkbox>
                <br>
                <Checkbox disabled checked>支持切换主题色</Checkbox>
                <br>
            </article>
        </div>

    </div>
</template>

<script>
    export default {
        data: function(){
            return {}
        }
    }
</script>

<style scoped>
    .ms-doc{
        width:100%;
        max-width: 980px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }
    .ms-doc h3{
        padding: 9px 10px 10px;
        margin: 0;
        font-size: 14px;
        line-height: 17px;
        background-color: #f5f5f5;
        border: 1px solid #d8d8d8;
        border-bottom: 0;
        border-radius: 3px 3px 0 0;
    }
    .ms-doc article{
        padding: 45px;
        word-wrap: break-word;
        background-color: #fff;
        border: 1px solid #ddd;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
    }
    .ms-doc article h1{
        font-size:32px;
        padding-bottom: 10px;
        margin-bottom: 15px;
        border-bottom: 1px solid #ddd;
    }
    .ms-doc article h2 {
        margin: 24px 0 16px;
        font-weight: 600;
        line-height: 1.25;
        padding-bottom: 7px;
        font-size: 24px;
        border-bottom: 1px solid #eee;
    }
    .ms-doc article p{
        margin-bottom: 15px;
        line-height: 1.5;
    }
    .ms-doc article .Checkbox{
        margin-bottom: 5px;
    }
</style>