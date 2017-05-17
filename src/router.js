import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/about',
            component: resolve => require(['./components/common/index.vue'], resolve),
            children: [{
                path: '',
                component: resolve => require(['./components/common/About.vue'], resolve)
            },
                {
                    path: '/form',
                    component: resolve => require(['./components/page/Form.vue'], resolve)
                },
                {
                    path: '/table',
                    component: resolve => require(['./components/page/Table.vue'], resolve)
                },
                {
                    path: '/config-manager',
                    component: resolve => require(['./components/page/Config/manager.vue'], resolve),

                },

                {
                    path: '/config-detail',
                    component: resolve => require(['./components/page/Config/detail.vue'], resolve)
                },
                {
                    path: '/config-modify',
                    component: resolve => require(['./components/page/Config/modify.vue'], resolve)
                },
                {
                    path: '/testlib-manager',
                    component: resolve => require(['./components/page/TestLib/manager.vue'], resolve)
                },
                {
                    path: '/table-test',
                    component: resolve => require(['./components/page/Config/table.vue'], resolve)
                }
                // {
                //     path: '/markdown-viewer',
                //     component: resolve => require(['./components/page/markdown-viewer.vue'], resolve)
                // },
                // {
                //     path: '/markdown-editor-1',
                //     component: resolve => require(['../components/page/markdown-editor-1.vue'], resolve)
                // },
                // {
                //     path: '/markdown-editor-2',
                //     component: resolve => require(['./components/page/markdown-editor-2.vue'], resolve)
                // },
                // {
                //     path: '/rtf',
                //     component: resolve => require(['./components/page/rtf.vue'], resolve)
                // },{
                //     path: '/upload',
                //     component: resolve => require(['./components/page/upload.vue'], resolve)
                // },{
                //     path: '/echarts',
                //     component: resolve => require(['./components/page/echarts.vue'], resolve)
                // }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['./components/page/Login.vue'], resolve)
        },
    ]
})
