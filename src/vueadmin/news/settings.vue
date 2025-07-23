<template>
    <div>
        <div id="bannersetter">
        <Card style="width:320px">
            <div style="text-align:center">
                <h3>设置网站首页Banner</h3>
            </div>
        </Card>

            <Form ref="bannerform" :model="bannerform" inline>
                <Form-item
                        label="链接"
                       >
                    <Row>
                        <Col span="16">
                        <Input type="text" v-model="bannerform.url" placeholder="请输入URL..."></Input>
                        </Col>
                        <Col span="4">
                        <!--选择图片-->
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


        <div id="slidesetter">
            <Card style="width:320px">
                <div style="text-align:center">
                    <h3>设置网站首页Slide</h3>
                </div>
            </Card>
            <Form ref="slideform" :model="slideform" inline>
                <Form-item
                    label="链接"
                    >
                <Row>
                    <Col span="16">
                    <Input type="text" v-model="slideform.url" placeholder="请输入URL..."></Input>
                    </Col>
                    <Col span="4">
                    <!--选择图片-->
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
                canEdit: G_CheckAdminPermission(17),
                query: {
                    queryType: 'title',
                    queryContent: ''
                },
                bannerform: {
                    url: '',
                },
                ruleInline: {
                    url: [
                        {required: true, message: '请填写url', trigger: 'blur'},
                        {type: 'string', min: 6, message: 'url不能小于6位', trigger: 'blur'},
                    ],
                },
                slideform: {
                },
                columns: [
                    {
                        width: 120,
                        title: 'a_id/url',
                        name: '编号',
                        key: 'a_id',
                        sortable: true
                    },
                    {
                        width: 450,
                        title: '图片',
                        name: 'img',
                        key: 'img',
                    },
                    {
                        width: 100,
                        title: '次序',
                        name: 'order',
                        key: 'order',
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
                        width: 150,
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
                                            this.moveup(params.index)
                                        }
                                    }
                                }, '提前'),
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
                                            this.movedown(params.index)
                                        }
                                    }
                                }, '后移'),
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
                selectedCategory: ''
            }
        },
        methods: {
//            ==================功能相关==================
            checkUrl(url){
                if (!util.isURL(url)) {
//                        this.$Message.error("The " + i + "nd item's value is not url string!!!");
                    this.$Message.error("你输入的网址非法!!!");
                    return false;
                }
                return true;
            },
            pushDataToShow(data)
            {
                //处理图片显示
            }
            ,
            //            ==================功能相关==================

            //            ==================跳转相关==================
            //            ==================跳转相关==================
            handleReset(name){
                this.$refs[name].resetFields();
                this.titleData = JSON.parse(G_GetStore('tableData'));
                this.update_data_list();
            },
            //            ==================显示相关==================

            //            ==================网络相关==================
            onCategoryChanged(){
                this.update_data_list();
            },
            update_data_list(){
                let url = req_get_scrolling_list;
                if (this.selectedCategory === 'all') {
                    this.tableData = JSON.parse(G_GetStore('tableData'))
                    return;
                }//减少不必要请求

                if (url.charAt(url.length-1) !== '&'){
                    url += "&"
                }
                if (this.selectedCategory && this.selectedCategory !== 'all') {
                    url += "category=" + this.selectedCategory + "&";
                }
                this.tableData = [];
                this.$axios.get(url)
                    .then(result => {
                        console.log('axios get data', result);
                        if (result && result.data && result.data.code == 200) {
                            for (let category in result.data.data) {
                                //TODO
                            }
                        }
                        console.log(this.tableData)
                    })
            },
            remove(index){
                this.$Modal.confirm({
                    title: '确认删除？',
                    onOk: () => {
//                        let postData =  [{type: this.tableData[index].type, a_id: this.tableData[index].a_id}];
                        let postData =  [{type: this.tableData[index].type, a_id: this.tableData[index].a_id, is_slide:0}];
                        this.$axios.post(req_set_scrolling_list,postData)
                            .then(result => {
                                console.log('(***************)', result);//524无权限
                                if (result && result.data && result.data.code == 200) {
                                    this.tableData.splice(index, 1);
                                    this.$Message.info('删除成功');
                                }
                            })
                    },
                    onCancel: () => {
                        this.$Message.info('您已取消删除');
                    },
                    content: `<strong>ID</strong>: ${this.tableData[index].a_id}<br><strong>标题<strong>: ${this.titleData[index].title}<br>类别: ${this.tableData[index].type}<br>`
                });
            },
            handleSubmit(form_name){
                let req_url = req_set_scrolling_list;
                let postData = {};
                if(form_name === "bannerform"){
                    postData['type'] = "banner";
                    postData['banner_list'] = [this.bannerform];
                }else if(form_name === "slideform"){
                    postData['type'] = "slide";
//                    # data['slide_list'] = [{'pic_path': '1.png', 'a_id': 'djflafj'}, {'pic_path': '2.png', 'a_id': '1241'}]
                    postData['slide_list'] = [this.slideform];
                }
                else{
                    return;
                }

                this.$axios.post(req_set_scrolling_list,postData)
                    .then(result => {
                        console.log('(***************)', result);//524无权限
                        if (result && result.data && result.data.code == 200) {
                            this.$Message.info('提交成功');
                        }
                    })
            },
            onSearch(){
                let url = req_news_query;
                if (this.query.queryType) {
                    url += "&queryType=" + this.query.queryType + "&queryContent=" + this.query.queryContent;
                }
                console.log("On search url&&&", url);
                this.$axios.get(url)
                    .then(result => {
                        if (result && result.data && result.data.code == 200) {
                            G_SetStore('tableData', JSON.stringify(this.tableData));//缓存
                            this.titleData = [];
                            for (let index in result.data.data) {
                                this.pushDataToShow(result.data.data[index]);
                            }
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

        },
        components: {
            goback,
        }
    }
</script>


<style src="../../../static/css/datasource.css">

</style>

