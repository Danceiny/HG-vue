<template>
    <div class="layout">
        <Row type="flex">
            <i-col span="3" class="layout-menu-left min-height">
                <Menu :active-name="active_name" theme="dark" width="auto" :open-names="open_names" ref="home_menu" @on-select="menuSeleted">
                    <div class="layout-logo-left">管理中心平台</div>
                    <Submenu v-for="subItem in data_menu" :name="subItem.name">
                        <template slot="title"><Icon :type="subItem.icon"></Icon>{{subItem.title}}</template>
                        <div v-for="item in subItem.items">
                            <Menu-group v-if="item.type=='group'" :title="item.title">
                                <router-link v-for="gitem in item.items" :to="'/'+gitem.link">
                                    <Menu-item :name="gitem.name" :ref="gitem.link">{{gitem.title}}</Menu-item>
                                </router-link>
                            </Menu-group>
                            <router-link v-else :to="'/'+item.link">
                                <Menu-item :name="item.name" :ref="item.link">{{item.title}}</Menu-item>
                            </router-link>
                        </div>
                    </Submenu>
                </Menu>
            </i-col>

            <i-col span="21" style="min-height">
                <div class="layout-header">
                    <Dropdown class="user_menu">
                        <a>{{admin_realname}}</a>
                        <Icon type="arrow-down-b"></Icon>
                        <Dropdown-menu slot="list">
                            <router-link v-for="user_menu_item in user_menu" :to="'/'+user_menu_item.link">
                                <Dropdown-item>{{user_menu_item.title}}</Dropdown-item>
                            </router-link>
                        </Dropdown-menu>
                    </Dropdown>
                </div>
                <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb-item>首页</Breadcrumb-item>
                        <Breadcrumb-item v-for="title in breadcrumb">{{title}}</Breadcrumb-item>
                        <!-- <Breadcrumb-item>页面</Breadcrumb-item>
                        <Breadcrumb-item>{{this.$route.path.replace(/(^\/*)|(\/*$)/g, '')}}</Breadcrumb-item> -->
                    </Breadcrumb>
                </div>
                <div class="layout-content">
                    <div class="layout-content-main">
                        <router-view v-on:fMenuSeleted="menuSeleted"></router-view>
                    </div>
                </div>
                <div class="layout-copy">
                    2015-2017 &copy; 湖北易康思科技有限公司
                </div>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                user_menu:[
                    {
                        link:"logout",
                        title:"退出",
                    }
                ],
                data_menu:[
                    {
                        name:"1",
                        title:"个人用户",
                        icon:"person",
                        items:[
                            {
                                link:"User",
                                name:"1-1",
                                title:"个人信息管理",
                                permission:1,
                            },
                            {
                                link:"ReviewList",
                                name:"1-2",
                                title:"个人报考管理",
                                permission:4,
                            },
                            {
                                link:"CerManager",
                                name:"1-4",
                                title:"证书管理",
                                permission:6,
                            }
                        ]
                    },
                    {
                        name:"5",
                        title:"考试管理",
                        icon:"ios-paper",
                        items:[
                            {
                                link:"ExamTime",
                                name:"5-1",
                                title:"考试时间管理",
                                permission:14,
                            },
                            {
                                link:"ExamItem",
                                name:"5-2",
                                title:"考试类目管理",
                                permission:20,
                            },
                            {
                                link:"ExamGroup",
                                name:"5-3",
                                title:"类目分组管理",
                                permission:18,
                            }
                        ]
                    },
                    {
                        name:"2",
                        title:"开发管理",
                        icon:"cube",
                        items:[
                            {
                                link:"config-manager",
                                name:"2-1",
                                title:"配置管理",
                                permission:10,
                            }
                        ]
                    },
                    {
                        name: "6",
                        title: "文章管理",
                        icon: "pricetags",
                        items: [
                            {
                                link: "news-manager",
                                name: "6-1",
                                title: "新闻管理",
                                permission: 16,
                            }
                        ]
                    },
                    {
                        name: "7",
                        title: "活动管理",
                        icon: "ios-game-controller-a",
                        items: [
                            {
                                link: "RedeemCode",
                                name: "7-1",
                                title: "优惠码管理",
                                permission: 26,
                            }
                        ]
                    },
                    {
                        name:"4",
                        title:"管理员中心",
                        icon:"ios-people",
                        items:[
                            {
                                link:"BossUser",
                                name:"4-1",
                                title:"管理员信息管理",
                                permission:12,
                            }
                        ]
                    }
                ],
                active_name:"",
                open_names:[],
                breadcrumb:[],
                admin_realname:''
            }
        },
        methods: {
            filterMenu(){
                let self = this
                let permission = G_GetStore("_admin_permission_")
                if(permission && permission.length>0){
                    permission = JSON.parse(permission)
                    if(permission.indexOf('all') >= 0) return; // 开放全部权限
                    for(var i=self.data_menu.length-1; i>=0; i--){
                        let items = self.data_menu[i].items
                        for(var j=items.length-1; j>=0; j--){
                            let item = items[j]
                            if(item.type === 'group'){
                                for(var z=item.items.length-1; z>=0; z--){
                                    let sub_item = item.items[z]
                                    if(sub_item.permission && permission.indexOf(sub_item.permission)<0){
                                        item.items.splice(z, 1)
                                    }
                                }
                                if(item.items.length == 0){
                                    items.splice(j, 1)
                                }
                            }else if(item.permission && permission.indexOf(item.permission)<0){
                                items.splice(j, 1)
                            }
                        }
                        if(items.length == 0){
                            self.data_menu.splice(i, 1)
                        }
                    }
                }
            },
            menuSeleted(){
                let self = this
                setTimeout(function(){
                    self.breadcrumb = []
                    let pathArray = self.$route.path.split("/")
                    if(pathArray.length > 1){
                        self.active_name = self.$refs[pathArray[1]][0].name
                        let array = self.active_name.split('-')
                        if(array.length > 0){
                            self.$refs['home_menu'].updateOpenKeys(array[0])
                            self.$refs['home_menu'].updateOpened()
                        
                            for(var i in self.data_menu){
                                if(self.data_menu[i].name == array[0]){
                                    self.breadcrumb.push(self.data_menu[i].title)
                                    for(var j in self.data_menu[i].items){
                                        let item = self.data_menu[i].items[j]
                                        if(item.type === "group"){
                                            self.breadcrumb.push(item.title)
                                            for(var z in item.items){
                                                if(item.items[z].name == self.active_name){
                                                    self.breadcrumb.push(item.items[z].title)
                                                    return
                                                }
                                            }
                                        }else if(item.name == self.active_name){
                                            self.breadcrumb.push(item.title)
                                            return
                                        }
                                    }
                                }
                            }
                        }
                    }
                }, 10)
            },
            updateSelfPermission(){
                this.$axios.get(req_update_self_permission)
                .then(result => {
                    if(result && result.data && result.data.code == 200){
                        // 更新权限成功
                        G_SetStore("_admin_permission_", JSON.stringify(result.data.permission))
                    }
                })
            }
        },
        created () {
            this.admin_realname = G_GetStore("_admin_realname_")
            if(!this.admin_realname || this.admin_realname.length == 0)
                this.admin_realname = G_GetStore("_admin_username_")
            
            this.updateSelfPermission()
            this.filterMenu()
            this.menuSeleted()
        }
    }
</script>

<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
        font-size: 18px;
        font-weight: 700;
        line-height: 30px;
        text-align: center;
        color: #fff;
    }
    .min-height{
        min-height: 900px;
    }
    .user_menu{
        float: right;
        font-size: 18px;
        margin: 15px 25px;
    }
</style>