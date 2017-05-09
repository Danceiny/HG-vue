import NotFound from "./views/404.vue";
import Home from "./views/Home.vue";
import Main from "./views/Main.vue";
import Table from "./views/Nav1/Table.vue";
import Form from "./views/Nav1/Form.vue";


const routers = [
    {
        path: '/',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        path: '/404',
        componnet: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: 'Nav 1',
        iconCls: '',//iview图标样式class
        children: [
            {path: '/main', component: Main, name: '主页', hidden: true},
            {path: '/table', component: Table, name: '表格'},
            {path: '/form', component: Form, name: '表单'},
            {path: '/user', component: user, name: '列表'},
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];
export default routers;