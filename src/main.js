import Vue from "vue";
import iView from "iview";
import ElementUI from 'element-ui';
import VueRouter from "vue-router";
import router from "./router";
import Util from "./libs/util";
import App from "./App.vue";
import "iview/dist/styles/iview.css";
import "font-awesome/css/font-awesome.min.css";


Vue.use(iView);
Vue.use(ElementUI);
Vue.config.productionTip = false;

// 路由配置
// const RouterConfig = {
//     mode: 'history',
//     routes: Routers
// };
// const router = new VueRouter(RouterConfig);


router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();

    // if (to.path == '/login') {
    //     sessionStorage.removeItem('user');
    // }
    // let user = JSON.parse(sessionStorage.getItem('user'));
    // if (!user && to.path != '/login') {
    //     next({path: '/login'})
    // } else {
    //     next()
    // }

});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
    // render: h => h(App)
});
