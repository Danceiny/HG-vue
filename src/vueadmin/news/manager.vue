<template>
    <div id="tree">

        <!--=================== 从url添加文章 ===================-->
        <div :v-show="canUrl">
        <Card style="width:500px;margin-left: auto;
margin-right: auto;">
            <div style="text-align:center">
                <h3>复制粘贴源站文章URL，一键添加到新站</h3>
            </div>
        </Card>
        <br>
        <Form ref="formInline" :model="formInline" :label-width="80" style="margin-left: auto;
margin-right: auto;">
            <Form-item
                    label="项目"
                    prop="url">
                <Row>
                    <Col span="16">
                    <Input type="text" v-model="formInline.url" placeholder="请输入URL..."></Input>
                    </Col>
                    <Col span="4">
                    <Button type="primary" @click="submitUrl('formInline')" style="margin-left: 8px">提交</Button>
                    </Col>
                    <Col span="4">
                    <Button type="ghost" @click="handleReset('formInline')" style="margin-left: 8px">重置</Button>
                    </Col>
                </Row>
            </Form-item>
        </Form>
        </div>
        <!--=================== 从url添加文章 ===================-->



        <Form ref="query" :model="query" inline>
            <Form-item prop="queryType">
                <Select v-model="query.queryType" placeholder="请选择" style="float: left;width: 100%;">
                    <Option value="a_id">按id搜索</Option>
                    <Option value="title">按标题搜索</Option>
                    <Option value="show_time">按时间搜索</Option>
                </Select>
            </Form-item>

            <Form-item prop="queryContent">
                <Input v-model="query.queryContent" placeholder="请输入" style="width: 100%;"></Input>
            </Form-item>

            <Form-item>
                <Button type="ghost" @click="handleReset('query')">重置</Button>
                <Button type="primary" @click="onSearch">搜索</Button>
            </Form-item>

        </Form>

        <div id="table">
            <br>
            <br>
            <Select v-on:on-change="onCategoryChanged" v-model="selectedCategory" placeholder="请选择"
                    style="float: left;width: 10%;">
                <Option value="all">全部</Option>
                <Option value="ggtz">公告通知</Option>
                <Option value="xzzq">下载专区</Option>
                <Option value="hydt">行业动态</Option>
                <Option value="xwzx">新闻资讯</Option>
                <Option value="zcfg">政策法规</Option>
                <Option value="xmhz">项目合作</Option>
            </Select>

            &nbsp;&nbsp;&nbsp;


            <Button type="primary" @click="add_new_article" v-show="canEdit">新增文章</Button>
            <!--<router-link to="news-manager/settings" ><Button type="primary"  v-show="canEdit">设置首页Banner等</Button></router-link>-->

            <br><br>
            <Table highlight-row
                   stripe
                   border
                   :columns="columns"
                   :data="titleData">
            </Table>

            <br>
            <goback confirm="false"></goback>
            <br>
            <br>
        </div>
    </div>
</template>

<script>
    import util from '../../util/utils.js';
    import goback from '../../components/common/trick/goback.vue';

    let new_type_map = [
        {"category": "ggtz", "type": "公告通知", "count": 9},
        {"category": "xwzx", "type": "新闻资讯", "count": 5},
        {"category": "hydt", "type": "行业动态", "count": 9},
        {"category": "zcfg", "type": "政策法规", "count": 5},
        {"category": "xmhz", "type": "项目合作", "count": 5},
        {"category": "xzzq", "type": "下载专区", "count": 5},
    ];
    const category_map = {
        "ggtz": "公告通知",
        "xwzx": "新闻资讯",
        "hydt": "行业动态",
        "zcfg": "政策法规",
        "xmhz": "项目合作",
        "xzzq": "下载专区",
    };
    export default {
        data () {
            return {
                canUrl: true,   //从url添加文章
                canEdit: G_CheckAdminPermission(17),
                query: {
                    queryType: 'title',
                    queryContent: ''
                },
                bool_search_table: false,
                formInline: {
                    url: '',
                },
                ruleInline: {
                    url: [
                        {required: true, message: '请填写url', trigger: 'blur'},
                        {type: 'string', min: 6, message: 'url不能小于6位', trigger: 'blur'},
                    ],
                },
                formDynamic: {
                    items: [
                        {
                            url: ''
                        }
                    ]
                },
                columns: [
                    {
                        width: 120,
                        title: '编号',
                        name: '编号',
                        key: 'a_id',
                        sortable: true
                    },
                    {
                        width: 450,
                        title: '标题',
                        name: 'Title',
                        key: 'title',
                        sortable: true
                    },
                    {
                        width: 100,
                        title: '分类',
                        name: 'Type',
                        key: 'type',
                        sortable: true
                    },
                    {
                        width: 100,
                        title: '修改时间',
                        name: 'update_time',
                        key: 'update_time',
                        sortable: true
                    },
                    {
                        width: 100,
                        title: '点击数',
                        name: 'hits',
                        key: 'hits',
                        sortable: true
                    },
                    {
                        width: 200,
                        title: '操作',
                        name: '操作',
                        key: 'operation',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modify(params.index)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.stick_news(params.index)
                                        }
                                    }
                                }, '置顶'),
                                this.canEdit && h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    },
                ],
                titleData: [],
                selectedCategory: ''
            }
        },
        methods: {
//            ==================功能相关==================
            checkUrl(url){
                if (!util.isURL(url)) {
                    this.$Message.error("你输入的网址非法!!!");
                    return false;
                }
                return true;
            },
            pushDataToShow(data)
            {
                if (!data.hasOwnProperty('update_time') || data['update_time'] === null || data['update_time'] === 0) {
                    data['update_time'] = data['show_time'];
                }
                if (data.hasOwnProperty('category')) {
                    data['type'] = category_map[data.category]
                }
                data['update_time'] = G_GetLocalTime(data['update_time'])
                data['show_time'] = G_GetLocalTime(data['show_time'])
                this.titleData.push(data);
            }
            ,
            //            ==================功能相关==================

            //            ==================跳转相关==================
            modify(index)
            {
                G_SetStore('itemId', JSON.stringify(this.titleData[index].a_id));
                G_SetStore('titleData', JSON.stringify(this.titleData));
                this.$router.push('/news-manager/detail/' + this.titleData[index].a_id);
            },
            add_new_article()
            {
                this.$router.push('/news-manager/detail');
            },
            //            ==================跳转相关==================
            handleReset(name){
                this.$refs[name].resetFields();
                if(name === 'query' && this.bool_search_table === true){
                    this.update_data_list();
                    this.bool_search_table = false;
                }
            },

            //            ==================显示相关==================

            //            ==================网络相关==================
            onCategoryChanged(){
                this.update_data_list();
            },

            submitUrl(name){
                let self = this;
                if (!this.checkUrl(self[name].url)) {
                    return;
                }
                let url = req_news_move_from_url;
                self.$refs[name].validate((valid) => {
                    if (valid) {
                        self[name].news_url = [];
                        let postUrls = {"news_url": []}
                        postUrls.news_url.push(self[name].url);

                        self.$axios.post(url, postUrls).then(result => {
                            if (result && result.data && result.data.code == 200) {
                                self.$Message.info('添加该新闻成功');
                                self.handleReset('formInline');
                            } else {
                                self.$Message.error('添加新闻失败');
                            }
                        });
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            update_data_list(){
                let url = req_news_fetch_news_title_list;
                console.log('8888888888',this.bool_search_table);
                if (this.selectedCategory === 'all' || this.bool_search_table === false) {
                    this.titleData = JSON.parse(G_GetStore('titleData'));
                    return;
                }//减少不必要请求

                if (url.charAt(url.length-1) !== '&'){
                    url += "&"
                }
                if (this.selectedCategory && this.selectedCategory !== 'all') {
                    url += "category=" + this.selectedCategory + "&";
                }
                this.titleData = [];
                this.$axios.get(url)
                    .then(result => {
                        if (result && result.data && result.data.code == 200) {
                            for (let category in result.data.data) {
                                let categoryList = result.data.data[category]
                                for (let item in categoryList) {
                                    categoryList[item].category = category;
                                    //push操作，对时间、类型作处理
                                    this.pushDataToShow(categoryList[item]);
                                }
                            }
                        }
//                        console.log(this.titleData)
                    })
            },
            stick_news(index){
                this.$Modal.confirm({
                    title: '确认置顶？',
                    onOk: () => {
                        this.$axios.post(req_news_modify, {action: "update", a_id: this.titleData[index].a_id,stick_time: new Date().getTime(),update_keys:['stick_time']})
                            .then(result => {
                                console.log('(***************)', result);//524无权限
                                if (result && result.data && result.data.code == 200) {
                                    this.$Message.info('置顶该文章成功');
                                }
                            })
                    },
                    onCancel: () => {
                        this.$Message.info('您已取消置顶');
                    },
                    content: `<strong>文章ID</strong>: ${this.titleData[index].a_id}<br><strong>标题<strong>: ${this.titleData[index].title}<br>类别: ${this.titleData[index].type}<br>`
                });
            },
            remove(index){
                this.$Modal.confirm({
                    title: '确认删除？',
                    onOk: () => {
                        this.$axios.post(req_news_modify, {action: "delete", a_id: this.titleData[index].a_id})
                            .then(result => {
                                console.log('(***************)', result);//524无权限
                                if (result && result.data && result.data.code == 200) {
                                    this.titleData.splice(index, 1);
                                    this.$Message.info('删除该文章成功');
                                }
                            })
                    },
                    onCancel: () => {
                        this.$Message.info('您已取消删除');
                    },
                    content: `<strong>文章ID</strong>: ${this.titleData[index].a_id}<br><strong>标题<strong>: ${this.titleData[index].title}<br>类别: ${this.titleData[index].type}<br>`
                });
            },
            onSearch(){
                if(this.query.queryContent === ''){
                    return;
                };
                let url = req_news_query;
                if (this.query.queryType) {
                    url += "&queryType=" + this.query.queryType + "&queryContent=" + this.query.queryContent;
                }
                console.log("On search url&&&", url);
                this.$axios.get(url)
                    .then(result => {
                        if (result && result.data && result.data.code == 200) {
                            G_SetStore('titleData', JSON.stringify(this.titleData));//缓存
                            this.titleData = [];
                            for (let index in result.data.data) {
                                this.pushDataToShow(result.data.data[index]);
                            }
                            this.bool_search_table = true;
                        }
                        else if (result.data.code == 526) {
                            //查找失败
                            this.$Message.error("很遗憾，未找到您需要的信息！温馨提示：请检查搜索类型与搜索内容是否匹配~")
                        }
                        else{
                            console.log('eeeeeeeeeee',result);
                        }
                    })
            },
            //            ==================网络相关==================
        },
        created: function () {
            this.$emit('fMenuSeleted'); // 更新父组件的面包屑
            if (G_GetStore('gobackwithme') === 'yes'){
                this.titleData = JSON.parse(G_GetStore('titleData'));
                G_RemoveStore('gobackwithme');
            }
            else {
                this.update_data_list();
            }
        },
        components: {
            goback,
        }
    }
</script>


<style src="../../../static/css/datasource.css">

</style>

