import Vue from "vue";
import iView from "iview";
import VueRouter from "vue-router";
import Routers from "./router";
import Util from "./libs/util";
import App from "./app.vue";
import "iview/dist/styles/iview.css";
import 'font-awesome/css/font-awesome.min.css'


Vue.use(VueRouter);
Vue.use(iView);

// 路由配置
// const RouterConfig = {
//     mode: 'history',
//     routes: Routers
// };
// const router = new VueRouter(RouterConfig);

const router = new VueRouter({
    Routers
})

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    // Util.title(to.meta.title);
    // next();

    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user && to.path != '/login') {
        next({path: '/login'})
    } else {
        next()
    }

});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});
