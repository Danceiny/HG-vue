import Vue from "vue";
import Router from "vue-router";
// import A from "@/components/A";
const App = resolve => require(['@/App'], resolve);
const BossLogin = resolve => require(['@/vueadmin/login/BossLogin'], resolve)
const BossUserList = resolve => require(['@/vueadmin/bossuser/BossUserList'], resolve);
const BossUserDetail = resolve => require(['@/vueadmin/bossuser/BossUserDetail'], resolve);
const UserList = resolve => require(['@/vueadmin/user/UserList'], resolve);
const UserDetail = resolve => require(['@/vueadmin/user/UserDetail'], resolve);
const ReviewList = resolve => require(['@/vueadmin/user/ReviewList'], resolve);
const CerManager = resolve => require(['@/vueadmin/user/CerManager'], resolve);
const CerDetail = resolve => require(['@/vueadmin/user/CerDetail'], resolve);
const config_manager = resolve => require(['@/vueadmin/config/manager.vue'], resolve);
const config_list = resolve => require(['@/vueadmin/config/list.vue'], resolve);
const config_detail = resolve => require(['@/vueadmin/config/detail.vue'], resolve);
const ExamTimeList = resolve => require(['@/vueadmin/exam/ExamTimeList.vue'], resolve);
const ExamTimeDetail = resolve => require(['@/vueadmin/exam/ExamTimeDetail.vue'], resolve);
const ExamGroupList = resolve => require(['@/vueadmin/exam/ExamGroupList.vue'], resolve);
const ExamGroupDetail = resolve => require(['@/vueadmin/exam/ExamGroupDetail.vue'], resolve);
const ExamItemList = resolve => require(['@/vueadmin/exam/ExamItemList.vue'], resolve);
const ExamItemDetail = resolve => require(['@/vueadmin/exam/ExamItemDetail.vue'], resolve);
const news_manager = resolve => require(['@/vueadmin/news/manager.vue'], resolve);
const news_detail = resolve => require(['@/vueadmin/news/detail.vue'], resolve);
const news_settings = resolve => require(['@/vueadmin/news/settings.vue'], resolve);
const RedeemCode = resolve => require(['@/vueadmin/activity/RedeemCode.vue'], resolve);

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'BossLogin',
            component: BossLogin
        },
        {
            path: '/logout',
            name: 'BossLogout',
            component: BossLogin
        },
        {
            path: '/',
            name: 'App',
            component: App,
            children: [
                {
                    path: '/User',
                    name: 'User',
                    component: UserList
                },
                {
                    path: '/User/Detail/:id_number',
                    name: 'UserDetail',
                    component: UserDetail
                },
                {
                    path: '/User/Detail',
                    name: 'UserDetail',
                    component: UserDetail
                },
                {
                    path: '/ReviewList',
                    name: 'ReviewList',
                    component: ReviewList
                },
                {
                    path: '/CerManager',
                    name: 'CerManager',
                    component: CerManager
                },
                {
                    path: '/CerManager/Detail/:cer_id',
                    name: 'CerDetail',
                    component: CerDetail
                },
                {
                    path: '/config-manager',
                    name: 'config-manager',
                    component: config_manager
                },
                {
                    path: '/config-manager/list',
                    name: 'config-list',
                    component: config_list
                },
                {
                    path: '/config-manager/list/:file',
                    name: 'config-list-file',
                    component: config_list
                },

                {
                    path: '/config-manager/list/:file/:section',
                    name: 'config-list-file-section',
                    component: config_list
                },
                {
                    path: '/config-manager/detail',
                    name: 'config-detail',
                    component: config_detail
                },
                {
                    path: '/config-manager/detail/item/:itemId',
                    name: 'config-detail',
                    component: config_detail
                },
                {
                    path: '/BossUser',
                    name: 'BossUserList',
                    component: BossUserList
                },
                {
                    path: '/BossUser/detail',
                    name: 'BossUserDetail',
                    component: BossUserDetail
                },
                {
                    path: '/BossUser/detail/:username',
                    name: 'BossUserDetail',
                    component: BossUserDetail
                },
                {
                    path: '/ExamTime',
                    name: 'ExamTimeList',
                    component: ExamTimeList
                },
                {
                    path: '/ExamTime/detail',
                    name: 'ExamTimeDetail',
                    component: ExamTimeDetail
                },
                {
                    path: '/ExamTime/detail/:itemId',
                    name: 'ExamTimeDtail',
                    component: ExamTimeDetail
                },
                {
                    path: '/ExamItem',
                    name: 'ExamItemList',
                    component: ExamItemList
                },
                {
                    path: '/ExamItem/Detail',
                    name: 'ExamItemDetail',
                    component: ExamItemDetail
                },
                {
                    path: '/ExamItem/Detail/:product_id',
                    name: 'ExamItemDetail',
                    component: ExamItemDetail
                },
                {
                    path: '/ExamGroup',
                    name: 'ExamGroupList',
                    component: ExamGroupList
                },
                {
                    path: '/ExamGroup/Detail',
                    name: 'ExamGroupDetail',
                    component: ExamGroupDetail
                },
                {
                    path: '/ExamGroup/Detail/:group_id',
                    name: 'ExamGroupDetail',
                    component: ExamGroupDetail
                },
                {
                    path: '/news-manager',
                    name: 'news-manager',
                    component: news_manager
                },
                {
                    path: '/news-manager/detail',
                    name: 'news-detail',
                    component: news_detail
                },
                {
                    path: '/news-manager/detail/:itemId',
                    name: 'news-detail',
                    component: news_detail
                },
                {
                    path: '/news-manager/settings',
                    name: 'news-settings',
                    component: news_settings
                },
                {
                    path: '/RedeemCode',
                    name: 'RedeemCode',
                    component: RedeemCode
                },
            ]
        }
    ]
});
