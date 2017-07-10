<template>
    <div>
        <div>
            <Date-picker type="datetimerange" placeholder="选择开考时间范围" style="width: 280px" v-model="searchCondition.exam_time_range"></Date-picker>
            <Select v-model="searchCondition.sort" class="w100">
                <Option-group v-for="group in searchDataOrderList" :label="group.label">
                    <Option v-for="order in group.orders" :value="order.value" :key="order">{{order.label}}</Option>
                </Option-group>
            </Select>
            <Button type="info" @click="onSearch" icon="search">筛选</Button>
            <Button @click="onResetSearchCondition">重置条件</Button>
            <Button v-show="canEdit" style="float: right;" @click="onAdd">新增</Button>
            <Page :total="oriTimeDatas.length" :current="currentPage" :nextDisable="nextDisable" show-elevator @on-change="onPageChange" :pageSize="pageSize" :beforeNextLoad="onBeforeNextLoad"  class="affix-top mt10"></Page>
        </div>
        
        <Table border :columns="columns" size="small" :data="timeDatas" class="mt10"></Table>
    </div>
</template>

<script>
import Page from '../../components/plugins/page';
export default {
    components:{
        Page
    },
    data () {
        return {
            canEdit:G_CheckAdminPermission(15),
            nextDisable: false,
            searchDataOrderList:[
                {
                    label:"按开考时间",
                    orders:[
                        {
                            value:"exam_time_aesc",
                            label:"顺序"
                        },
                        {
                            value:"exam_time_desc",
                            label:"逆序"
                        }
                    ]
                },
                {
                    label:"按截止时间",
                    orders:[
                        {
                            value:"apply_limit_time_aesc",
                            label:"顺序"
                        },
                        {
                            value:"apply_limit_time_desc",
                            label:"逆序"
                        }
                    ]
                }
            ],
            searchCondition: {},
            searchConditionReal: {},
            pageCount: 10,
            currentPage:1,
            pageSize:15,
            oriTimeDatas:[],
            timeDatas:[],
            columns:[
                {title: 'id', key: 'time_id', align: 'center', width: 110},
                {title: '开考时间', key: 'exam_time', align: 'center', width: 160},
                {title: '结束时间', key: 'exam_time_end', align: 'center', width: 160},
                {title: '报名截止时间', key: 'apply_limit_time', align: 'center', width: 160},
                {title: '备注', key: 'remark'},
                {
                    width: 130,
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
                                        this.onDetail(params)
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
                                        this.onRemove(params)
                                    }
                                }
                            }, '删除') : null
                        ]);
                    }
                }
            ]
        }
    },
    created () {
        this.$emit('fMenuSeleted'); // 更新父组件的面包屑
        this.onResetSearchCondition()
        this.onSearch()
    },
    methods: {
        onSearch(){
            this.currentPage = 1
            this.nextDisable = false
            this.timeDatas = []
            this.oriTimeDatas = []
            this.searchConditionReal = G_DeepCopy(this.searchCondition)
            if(this.searchConditionReal.exam_time_range){
                this.searchConditionReal.exam_time_start = G_DatetimeToTimeStamp(this.searchConditionReal.exam_time_range[0])
                this.searchConditionReal.exam_time_end = G_DatetimeToTimeStamp(this.searchConditionReal.exam_time_range[1])
            }else{
                this.searchConditionReal.exam_time_start = ''
                this.searchConditionReal.exam_time_end = ''
            }
            this.fetchDatas(false)
        },
        onResetSearchCondition(){
            this.searchCondition = {
                exam_time_range: null,
                sort:"exam_time_desc"
            }
        },
        onAdd(){
            this.$router.push("/ExamTime/detail")
        },
        onRemove(data){
            this.$Modal.confirm({
                title: '确认删除？',
                onOk: () => {
                    this.$axios.post(req_examtime_modify, {action:"delete",time_id:data.row.time_id})
                    .then(result =>{
                        if(result && result.data && result.data.code == 200){
                            this.$Message.info('删除成功');
                            
                            this.oriTimeDatas.splice(data.row.itemIndex, 1);
                            this.flagDatas()
                            if(this.oriTimeDatas.length % this.pageSize == 0 && this.currentPage > 1){
                                this.currentPage--
                            }
                            this.onPageChange(this.currentPage)
                        }else{
                            this.$Message.error('删除失败');
                        }
                    })
                },
                onCancel: () => {
                    this.$Message.info('您已取消删除');
                },
                content: `<strong>id</strong>: ` + data.row.time_id + `<br>开考时间: ` + data.row.exam_time
            });
        },
        onDetail(data){
            this.$router.push("/ExamTime/detail/"+data.row.time_id)
        },
        flagDatas(){
            for(let i in this.oriTimeDatas){
                this.oriTimeDatas[i].itemIndex = parseInt(i)
            }
        },
        fetchDatas(more){
            let url = req_examtime_list 
            url += "&sort=" + this.searchConditionReal.sort
            url += "&time_id_start=" + this.searchConditionReal.exam_time_start
            url += "&time_id_end=" + this.searchConditionReal.exam_time_end
            url += "&page_count=" + this.pageCount // 一次拉多少页
            url += "&page_size=" + this.pageSize
            url += "&page_current=" + (this.currentPage + (more ? 1 : 0))
            
            this.$axios.get(url)    //请求的数据
            .then(result => {
                if(result && result.data && result.data.code == 200){
                    let time_datas = result.data.data
                    if(time_datas.length < this.pageSize * this.pageCount){
                        // 后面再没有数据了
                        this.nextDisable = true
                        if(time_datas.length == 0){
                            if(more){
                                this.currentPage -= 1
                            }
                            this.onPageChange(this.currentPage)
                            return
                        }
                    }
                    
                    for(let i in time_datas){
                        let item = time_datas[i]
                        item['exam_time_end'] = G_GetLocalTime(item['exam_time']+item['exam_length'])
                        item['exam_time'] = G_GetLocalTime(item['exam_time'])
                        item['apply_limit_time'] = G_GetLocalTime(item['apply_limit_time'])
                        this.oriTimeDatas.push(item)
                    }
                    
                    // 给每个item标号
                    this.flagDatas()
                    
                    this.onPageChange(this.currentPage)
                }
            })
        },
        onPageChange(page){
            this.currentPage = page
            this.timeDatas = this.oriTimeDatas.slice((page-1)*this.pageSize, page*this.pageSize)
        },
        onBeforeNextLoad(obj, value){
            this.fetchDatas(true)
            return false
        }
    }
}
</script>

<style scoped>
    .affix-top{
        background-color:white;
    }
    .ivu-date-picker{
        display: inline-block;
    }
    .w100{
        width:100px;
    }
    .mt10{
      margin-top:10px;
    }
</style>
