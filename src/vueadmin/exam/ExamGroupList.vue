<template>
    <div>
        <Button v-show="canEdit" style="float: right;" @click="onAdd">新增</Button>
        <br><br>
        <Table border :columns="columns" size="small" :data="datas" class="mt10"></Table>
    </div>
</template>

<script>
export default {
    data () {
        return {
            canEdit:G_CheckAdminPermission(19),
            columns:[
                {
                    width: 80,
                    title: '操作',
                    name: '操作',
                    key: 'operation',
                    align: 'center',
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.onDetail(params)
                                }
                            }
                        }, '查看')
                    }
                },
                {title: '分组ID', key: 'group_id', align: 'center', width: 120},
                {title: '分组名称', key: 'group_name', align: 'center', width: 300},
                {title: '分组描述', key: 'des', align: 'center', width: 300},
                {title: '状态', key: 'status', align: 'center', width: 80},
                {title: '最近更新时间', key: 'update_time', align: 'center', width: 160},
                {title: '备注', key: 'remark', width:300},
            ],
            datas:[]
        }
    },
    created () {
        this.$emit('fMenuSeleted'); // 更新父组件的面包屑
        
        let url = req_examgroup_list
        
        this.$axios.get(url)    //请求的数据
        .then(result => {
            if(result && result.data && result.data.code == 200){
                for(let i in result.data.data){
                    let item = result.data.data[i]
                    item['update_time'] = G_GetLocalTime(item['update_time'], true)
                    
                    switch(item['status']){
                        case 1:
                            item['status'] = "<span style='color:red'>不开放</span>"
                            break;
                        default:
                            item['status'] = "<span style='color:green'>开放</span>"
                            break;
                    }
                }
                this.datas = result.data.data
            }
        })
    },
    methods: {
        onDetail(index){
            this.$router.push("/ExamGroup/Detail/"+index.row.group_id)
        },
        onAdd(){
            this.$router.push("/ExamGroup/Detail")
        }
    }
}
</script>

<style scoped>
</style>
