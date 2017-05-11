<template>
    <div>
        <div>
            <Tree :data="SMSCenter" show-checkbox ref="SMSCenter" on-check-change="goToDetails()">

            </Tree>
            <Button type="text" @click.native="goToDetails('SMSCenter')">查看详情</Button>

            <Tree :data="ApplyCenter" show-checkbox ref="ApplyCenter"></Tree>
            <!--<Tree :data="Center" show-checkbox></Tree>-->
        </div>
        <div class="button">
            <!--<Button>Default</Button>-->
            <!--<Button type="primary">Primary</Button>-->
            <!--<Button type="ghost">Ghost</Button>-->
            <!--<Button type="dashed">Dashed</Button>-->
            <Button type="text" @click.native="goToDetails">查看详情</Button>
            <!--<br><br>-->
            <!--<Button type="info">信息按钮</Button>-->
            <!--<Button type="success">成功按钮</Button>-->
            <!--<Button type="warning">警告按钮</Button>-->
            <!--<Button type="error">错误按钮</Button>-->
        </div>
    </div>
</template>


<script>
    export default {
        data () {
            return {
                baseData: [{
                    expand: true,
                    title: 'parent 1',
                    children: [{
                        title: 'parent 1-0',
                        expand: true,
                        disabled: true,
                        children: [{
                            title: 'leaf',
                            disableCheckbox: true
                        }, {
                            title: 'leaf',
                        }]
                    }, {
                        title: 'parent 1-1',
                        expand: true,
                        checked: true,
                        children: [{
                            title: '<span style="color: red">leaf</span>',
                        }]
                    }]
                }],
                SMSCenter: [{
                    expand: true,
                    title: 'SMSCenter',
                    children: [{
                        title: 'SMSCenter',
                        expand: false,
                        checked: false
                    }]
                }],
                ApplyCenter: [{
                    expand: true,
                    title: 'ApplyCenter',
                    children: [{
                        title: 'RDS',
                        expand: false,
                        checked: false
                    }]
                }]
            }
        },

        methods: {

            goToDetails(tree){
                let node = self.$refs[tree].getSelectedNodes();
                console.log(node);
            }
        },

        created: function () {
            //TODO: get config data from ip:port/getconfig/


            //TODO: store config data to window.localstorage, setItem('config',CONFIGDATA)
        },
    }
</script>

<!--<template>-->
<!--<div>-->
<!--<el-tree-->
<!--:data="data2"-->
<!--:props="defaultProps"-->
<!--show-checkbox-->
<!--node-key="id"-->
<!--default-expand-all-->
<!--node-click="nodeDetail"-->
<!--:expand-on-click-node="false"-->
<!--:render-content="renderContent">-->
<!--</el-tree>-->
<!--&lt;!&ndash;<Table v-if="nodeSelected" height="200" :columns="columns1" :data="tableData" ></Table>&ndash;&gt;-->
<!--&lt;!&ndash;<details></details>&ndash;&gt;-->
<!--</div>-->
<!--</template>-->


<!--<script>-->
<!--let id = 1000;-->
<!--//  var Child = {-->
<!--//  template: '<div>A custom component!</div>'-->
<!--//};-->
<!--//    beforeCreate: function () {-->
<!--//  this.$options.components.details = require('./tree-folder-contents.vue')-->
<!--//}-->

<!--//    import details from './detail.vue';-->
<!--export default {-->
<!--data() {-->
<!--return {-->
<!--data2: [{-->
<!--id: 1,-->
<!--label: '一级 1',-->
<!--children: [{-->
<!--id: 4,-->
<!--label: '二级 1-1',-->
<!--children: [{-->
<!--id: 9,-->
<!--label: '三级 1-1-1'-->
<!--}, {-->
<!--id: 10,-->
<!--label: '三级 1-1-2'-->
<!--}]-->
<!--}]-->
<!--}, {-->
<!--id: 2,-->
<!--label: '一级 2',-->
<!--children: [{-->
<!--id: 5,-->
<!--label: '二级 2-1'-->
<!--}, {-->
<!--id: 6,-->
<!--label: '二级 2-2'-->
<!--}]-->
<!--}, {-->
<!--id: 3,-->
<!--label: '一级 3',-->
<!--children: [{-->
<!--id: 7,-->
<!--label: '二级 3-1'-->
<!--}, {-->
<!--id: 8,-->
<!--label: '二级 3-2'-->
<!--}]-->
<!--}],-->
<!--defaultProps: {-->
<!--children: 'children',-->
<!--label: 'label'-->
<!--}-->
<!--}-->
<!--},-->

<!--methods: {-->
<!--append(store, data) {-->
<!--store.append({id: id++, label: 'testtest', children: []}, data);-->
<!--},-->

<!--remove(store, data) {-->
<!--store.remove(data);-->
<!--},-->
<!--nodeDetail(node_obj, node, component){-->

<!--},-->
<!--goToDetails(store, data){-->
<!--//          console.log(this.$refs.getCheckedNodes);-->
<!--this.$router.push({path: '/config-detail'});-->
<!--},-->

<!--renderContent(h, { node, data, store }) {-->
<!--return (-->
<!--<span>-->
<!--<span>-->
<!--<span>{node.label}</span>-->
<!--</span>-->
<!--<span style="margin-right: 20px">-->

<!--<el-button size="mini" on-click={ () => this.goToDetails(store, data) }>Details</el-button>-->
<!--</span>-->
<!--</span>);-->
<!--}-->
<!--},-->
<!--//                    beforeCreate: function () {-->
<!--//  this.$options.components.details = require('./detail.vue')-->
<!--//},-->
<!--//        components: {-->
<!--//            // <my-component> 将只在父模板可用-->
<!--//            'my-component': details-->
<!--//-->
<!--//        }-->
<!--};-->
<!--</script>-->


<!--//    float:right          <el-button size="mini" on-click={ () => this.append(store, data) }>Append</el-button>-->
<!--//              <el-button size="mini" on-click={ () => this.remove(store, data) }>Delete</el-button>-->