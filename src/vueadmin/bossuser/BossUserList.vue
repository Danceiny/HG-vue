<template>
   <div>
       <div>
           <Input placeholder="搜索管理员账号" class="w200" v-model=searchData.username></Input>
           <Button type="info" @click="onSearch" icon="search">搜索</Button>
           <Button v-show="canEdit" style="float: right;" @click="onAdd">新增</Button>
       </div>
       
       <Table class="mt10" border :columns="columns" :data="userDatas" ></Table>
   </div>
</template>

<script>
    export default {
        data () {
            return {
                canEdit:G_CheckAdminPermission(13),
                searchData:{
                    username:'',
                },
                columns: [
                    // {type: 'selection', width: 50, align: 'center'},
                    {title: '账号', key: 'username', align: 'center', sortable: true},
                    {title: '姓名', key: 'realname', align: 'center', sortable: true},
                    {title: '备注', key: 'remark', align: 'center'},
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
                                            this.onView(params.index)
                                        }
                                    }
                                }, '查看'),
                                this.canEdit ? h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.onRemove(params.index)
                                        }
                                    }
                                }, '删除') : null
                            ]);
                        }
                    }
                ],
                userDatas:[]
            }
        },
        methods:{
            fetchUserDatas(username){
                let url = req_bossuser_list + "&username=" + (username?username:'')
                this.$axios.get(url)    //请求的数据
                .then(result => {
                  if(result && result.data && result.data.code == 200){
                      this.userDatas = result.data.data
                  }
                })
            },
            onSearch(){
                this.fetchUserDatas(this.searchData.username)
            },
            onAdd(){
                this.$router.push("/BossUser/detail")
            },
            onView(index){
                this.userDatas[index].action = "modify"
                G_SetStore('bossUserDetail', JSON.stringify(this.userDatas[index]));
                this.$router.push("/BossUser/detail/"+this.userDatas[index].username)
            },
            onRemove(index){
                this.$Modal.confirm({
                    title: '确认删除？',
                    onOk: () => {
                        // 删除
                        this.$axios.post(req_bossuser_modify, {action:"delete",username:this.userDatas[index].username})
                        .then(result =>{
                            if(result && result.data && result.data.code == 200){
                                this.userDatas.splice(index, 1);
                                this.$Message.info('删除管理员成功');
                            }
                        })
                    },
                    onCancel: () => {
                        this.$Message.info('您已取消删除');
                    },
                    content: `<strong>账号</strong>: ${this.userDatas[index].username}<br>姓名: ${this.userDatas[index].realname}`
                });
            }
        },
        created(){
            this.$emit('fMenuSeleted'); // 更新父组件的面包屑
            
            this.fetchUserDatas()
            G_RemoveStore("bossUserDetail")
        }
    }
</script>

<style scoped>
    .w200{
      width:200px;
    }
    .mt10{
      margin-top:10px;
    }
</style>
