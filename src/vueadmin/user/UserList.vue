<template>
    <div>
        <div class="affix-top">
            <div>
                <Input placeholder="姓名" class="w80" v-model=searchCondition.name ></Input>
                <Input placeholder="身份证" class="w150" v-model=searchCondition.id ></Input>
                <Input placeholder="手机号" class="w100" v-model=searchCondition.phone ></Input>
                <Input placeholder="邮箱" class="w150" v-model=searchCondition.email ></Input>
                <Select v-model="searchCondition.sort" class="w100">
                    <Option-group v-for="group in searchDataOrderList" :label="group.label">
                        <Option v-for="order in group.orders" :value="order.value" :key="order">{{order.label}}</Option>
                    </Option-group>
                </Select>
                <Button type="info" @click="onSearch" icon="search">筛选</Button>
                <Button @click="onResetSearchCondition">重置条件</Button>
            </div>

            <div class="mt10">
                <Button v-show="canSendSMS" type="info" @click="onSendSMS" icon="android-textsms">发短信</Button>
            </div>

            <Page show-total :virtual_total="oriVirtualUserDatasCount"  :total="oriUserDatas.length" :current="currentPage" :nextDisable="nextDisable" show-elevator @on-change="onPageChange" :pageSize="pageSize" :beforeNextLoad="onBeforeNextLoad"  class="affix-top mt10"></Page>
        </div>
        
        <Table border :columns="columns" size="small" :data="showUserDatas" class="mt10" @on-selection-change="onTableSelectionChange"></Table>
        
        <SMSDialog v-model="bShowSMSDialog" :id_numbers="smsIdNumbers"></SMSDialog>
    </div>
</template>

<script>
import Page from '../../components/plugins/page';
import SMSDialog from '../../components/plugins/sms/SMSDialog.vue';
export default {
    components:{
        Page,
        SMSDialog
    },
    data(){
        return {
            searchDataOrderList:[
                {
                    label:"按注册时间",
                    orders:[
                        {
                            value:"create_time_aesc",
                            label:"顺序"
                        },
                        {
                            value:"create_time_desc",
                            label:"逆序"
                        }
                    ]
                }
            ],
            bShowSMSDialog:false,
            smsIdNumbers:[],
            canSendSMS:G_CheckAdminPermission(3),
            searchCondition: {},
            searchConditionReal: {},
            pageCount: 10,
            pageSize: 40,
            currentPage: 1,
            nextDisable:false,
            columns: [
                { type: 'selection', width: 50, fixed: 'left'},
                {
                    title: '操作',
                    fixed: 'left',
                    key: 'action',
                    width: 70,
                    align: 'center',
                    render: (h, params) => {
                        return h('Button', {
                                props: { type: 'success', size: 'small' },
                                style: { width: '40px', marginTop: '5px'},
                                on: { click: () => { this.onUserDetail(params) }}
                            }, '详情')
                    }
                },
                { title: '基本信息', fixed: 'left', key: 'base_info', width: 170},
                { title: '头像', key: 'avatar', width: 130},
                { title: '联系信息', key: 'address_info', width: 200 },
                { title: '教育信息', key: 'education_info', width: 200 },
                { title: '工作信息', key: 'work_info', width: 200 },
                { title: '注册时间', key: 'create_time', width: 105 },
            ],
            showUserDatas:[],
            oriUserDatas:[],
            oriVirtualUserDatasCount:0
        }
    },
    methods:{
        checkPermission(){
            // 不具短信的，不展示选择栏
            if(!this.canSendSMS){
                this.columns.splice(0, 1)
            }
        },
        onResetSearchCondition(){
            this.searchCondition = {
                name:'',
                id:'',
                phone:'',
                email:'',
                sort:"create_time_desc",
            }
        },
        makeUrl(){
            let url = req_user_info_list
            url += "&id_number=" + this.searchConditionReal.id
            url += "&name=" + this.searchConditionReal.name
            url += "&phone_number=" + this.searchConditionReal.phone
            url += "&email=" + this.searchConditionReal.email
            return url 
        },
        onSearch(){
            // 非追加模式
            this.currentPage = 1
            this.nextDisable = false
            
            this.searchConditionReal = G_DeepCopy(this.searchCondition)
            
            this.oriUserDatas = []
            this.showUserDatas = []
            this.fetchUserDatas(false)
        },
        makeItem(item){
            item['email'] = (item['email'] && item['email'] !== 'None') ? item['email'] : ''
            item['base_info'] = item['name'] + "<br>" + item['id_number'] + "<br>" + (item['sex']?"女":"男") + "<br>" + (item['racial']?item['racial']:'未知民族')
            if(item['head_img'])
                item['avatar'] = "<img width=100 height=120 src="+item['head_img'] + ">"
            item['address_info'] = item['phone_number'] + "<br>" + item['email']
            if(item['address_province'] && item['address_province'] !== 'None')
                item['address_info'] += "<br>" + item['address_province']+"-"+item['address_city'] + "<br>" + item['address_detail']
            if(item['graduate_school'] && item['graduate_school'] !== 'None')
                item['education_info'] = item['graduate_school'] + "<br>" + item['graduate_career'] + "<br>" + item['degree'] + "<br>" + item['graduate_time']
            if(item['work_company'] && item['work_company'] !== 'None')
                item['work_info'] = item['work_company'] + "<br>" + item['work_title']
            
            
            return item
        },
        fetchUserDatas(more){
            let url = this.makeUrl() 
            url += "&page_count=" + this.pageCount // 一次拉多少页
            url += "&page_size=" + this.pageSize
            url += "&page_current=" + (this.currentPage + (more ? 1 : 0))
            url += "&sort=" + this.searchConditionReal.sort
            url += "&need_user_total=1"
            this.$axios.get(url)    //请求的数据
            .then(result => {
                if(result && result.data){
                    if(result.data.total_count != undefined){
                        this.oriVirtualUserDatasCount = result.data.total_count
                    }else{
                        this.oriVirtualUserDatasCount = 0
                    }
                    
                    if(result.data.datas.length < this.pageSize * this.pageCount){
                        // 后面再没有数据了
                        this.nextDisable = true
                        if(result.data.length == 0){
                            if(more){
                                this.currentPage -= 1
                            }
                            this.onPageChange(this.currentPage)
                            return
                        }
                    }
                    
                    for(let i in result.data.datas){
                        let item = result.data.datas[i]
                        let flag = false
                        // 排重
                        for(let j in this.oriUserDatas){
                            if(item['id_number'] === this.oriUserDatas[j]['id_number']){
                                flag = true
                                break
                            }
                        }
                        if (flag) continue;
                        
                        item = this.makeItem(item)
                        if(item){
                            item.itemIndex = this.oriUserDatas.length
                            this.oriUserDatas.push(item)
                        }
                    }
                    this.onPageChange(this.currentPage)
                }
            })
        },
        onUserDetail(index){
            window.open('#/User/Detail/'+index.row.id_number, '_blank')
        },
        onTableSelectionChange(array){
            for(let i in this.showUserDatas){
                this.showUserDatas[i]._checked = false
            }
            for(let i in array){
                this.oriUserDatas[array[i].itemIndex]._checked = true
            }
        },
        onPageChange(page){
            this.currentPage = page
            this.showUserDatas = this.oriUserDatas.slice((page-1)*this.pageSize, page*this.pageSize)
        },
        onBeforeNextLoad(obj, value){
            this.fetchUserDatas(true)
            return false
        },
        onSendSMS(){
            let id_numbers = []
            for(let i in this.oriUserDatas){
                let item = this.oriUserDatas[i]
                if(item._checked)
                    id_numbers.push(item.id_number)
            }
            if(id_numbers.length == 0){
                this.$Message.error("请至少选择一项！")
                return
            }
            this.smsIdNumbers = id_numbers
            
            this.bShowSMSDialog = true
        }
    },
    created () {
        this.$emit('fMenuSeleted'); // 更新父组件的面包屑
        this.checkPermission()
        this.onResetSearchCondition()
    }
}
</script>

<style scoped>
    .affix-top{
        background-color:white;
    }
    .w80{
        width:80px;
    }
    .w100{
        width:100px;
    }
    .w150{
        width:150px;
    }
    .w200{
        width:200px;
    }
    .mt10{
        margin-top:10px;
    }
</style>
