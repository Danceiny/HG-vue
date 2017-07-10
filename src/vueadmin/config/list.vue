<template>
    <div id="detail">
        <div v-show="canEdit">
            <Button type="primary" @click="add_new_config">新增</Button>
        </div>
        <br>
        <Table highlight-row
               stripe
               border
               :columns="columns"
               :data="configData">
        </Table>
        <br>
        <goback confirm="false"></goback>
        <br>
        <br>
    </div>
</template>

<script>
    import goback from '../../components/common/trick/goback.vue';
    export default {
        data () {
            const self = this;
            return {
                canEdit : G_CheckAdminPermission(11),
                columns: [
                    {
                        width: 80,
                        title: '编号',
                        name: '编号',
                        key: 'id',
                        sortable: true
                    },
                    {
                        width: 150,
                        title: 'File',
                        name: 'File',
                        key: 'file',
                        sortable: true
                    },
                    {
                        width: 150,
                        title: 'Section',
                        name: 'Section',
                        key: 'section',
                        sortable: true
                    },
                    {
                        width: 150,
                        title: 'Key',
                        name: 'Key',
                        key: 'key',
                        sortable: true
                    },
                    {
                        title: 'Value',
                        name: 'Value',
                        key: 'value',
                    },
                    {
                        width: 150,
                        title: '备注',
                        name: '备注',
                        key: 'remark',
                    },
                    {
                        width: 70,
                        title: '类型',
                        key: 'type',
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
                                            this.modify(params.index)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
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
                configData: [],
            };   //end of return
        },      //end of data()
        methods: {
            add_new_config(){
                G_SetStore('fileandsection', JSON.stringify(this.$route.params));
                this.$router.push('/config-manager/detail');
            },
            remove(index){
                this.$Modal.confirm({
                    title: '确认删除？',
                    onOk: () => {
                        // 删除
                        this.$axios.post(req_config_modify, {action:"delete",id:this.configData[index].id})
                        .then(result =>{
                            if(result && result.data && result.data.code == 200){
                                this.configData.splice(index, 1);
                                this.$Message.info('删除该配置项成功');
                            }
                        })
                    },
                    onCancel: () => {
                        this.$Message.info('您已取消删除');
                    },
                    content: `<strong>id</strong>: ${this.configData[index].id}<br>File: ${this.configData[index].file}<br>Section: ${this.configData[index].section}<br>Key: ${this.configData[index].key}`
                });
            },
            modify(index){
                G_SetStore('itemDetail', JSON.stringify(this.configData[index]));
                this.$router.push('/config-manager/detail/item/' + this.configData[index].id);
            },
            update_data_list(){
                let _params = this.$route.params
                let url = req_config_list
                if(_params.file)
                    url += "&file=" + _params.file
                if(_params.section)
                    url += "&section=" + _params.section
                this.$axios.get(url)
                .then(result => {
                    if(result && result.data && result.data.code == 200){
                        this.configData = result.data.data
                    }
                })
            },
            checkCanEdit(){
                // 不具编辑权限的，不展示操作栏
                if(!this.canEdit)
                    this.columns.splice(this.columns.length-1, 1)
            }
        },//end of methods
        created: function () {
            this.$emit('fMenuSeleted'); // 更新父组件的面包屑
            this.update_data_list()
            G_RemoveStore("itemDetail")
            G_RemoveStore("fileandsection")
            this.checkCanEdit()
        },
        components: {
            goback
        }
    }

</script>

<style src="../../../static/css/datasource.css">
</style>