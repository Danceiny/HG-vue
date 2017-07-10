<template>
    <div>
        <div class="affix-top">
            <div>
                <Input placeholder="姓名" class="w80" v-model=searchCondition.name ></Input>
                <Input placeholder="身份证" class="w150" v-model=searchCondition.id_number ></Input>
                <Input placeholder="证书编号" class="w150" v-model=searchCondition.cer_no ></Input>
                <Select v-model="searchCondition.sort" class="w100">
                    <Option-group v-for="group in searchDataOrderList" :label="group.label">
                        <Option v-for="order in group.orders" :value="order.value" :key="order">{{order.label}}</Option>
                    </Option-group>
                </Select>
                <Button type="info" @click="onSearch" icon="search">筛选</Button>
                <Button @click="onResetSearchCondition">重置条件</Button>
                <p class="mt10"></p>
                <Select v-model="searchCondition.cer_status" class="w100">
                  <Option v-for="item in statusList" :value="item.value" :key="item">{{ item.label }}</Option>
                </Select>
                <Select v-model="searchCondition.paid_status" class="w150">
                  <Option v-for="item in paidStatusList" :value="item.value" :key="item">{{ item.label }}</Option>
                </Select>
            </div>
            <div class="mt10">
                <Button v-show="canSendSMS" type="info" @click="onSendSMS" icon="android-textsms">发短信</Button>
                <Button v-show="canExport" @click="exportCerDatas" icon="ios-cloud-download-outline">导出</Button>
                <Upload action="" :before-upload="importPreview" v-show="canImport">
                    <Button icon="ios-cloud-upload-outline">证书信息导入</Button>
                </Upload>    
            </div>
            <Page show-total :virtual_total="oriVirtualCerDatasCount" :total="oriCerDatas.length" :current="currentPage" :nextDisable="nextDisable" show-elevator @on-change="onPageChange" :pageSize="pageSize" :beforeNextLoad="onBeforeNextLoad"  class="affix-top mt10"></Page>
        </div>
        
        <Table border :columns="columns" size="small" :data="cerDatas" class="mt10" @on-selection-change="onTableSelectionChange" height="600"></Table>
        
        <SMSDialog v-model="bShowSMSDialog" :id_numbers="smsIdNumbers"></SMSDialog>
        <ImportDialog v-model="bShowImportDialog" :columns="importColums" :data="importDatas" :onOK="onImportPost"></ImportDialog>
    </div>
</template>

<script>
import Page from '../../components/plugins/page';
import SMSDialog from '../../components/plugins/sms/SMSDialog.vue';
import ImportDialog from '../../components/plugins/importdialog/ImportDialog.vue';

let _headers = [
    {title:"申请编号", key:'cer_id', col:{wch:35}},
    {title:"姓名", key:'name', col:{wch:12}},
    {title:"照片", key:'image', col:{wch:10}},
    {title:"身份证号", key:'id_number', col:{wch:24}},
    {title:"省份", key:'province', col:{wch:12}},
    {title:"联系方式", key:'phone', col:{wch:14}},
    {title:"证书名称", key:'cer_name', col:{wch:40}},
    {title:"收件地址", key:'address', col:{wch:58}},
    {title:"邮编", key:'address_zipcode', col:{wch:10}},
    {title:"收件人", key:'address_name', col:{wch:10}},
    {title:"收件人电话", key:'address_phone', col:{wch:14}},
    {title:"证书编号", key:'cer_no', col:{wch:35}},
    {title:"颁发机构", key:'issue_name', col:{wch:20}},
    {title:"颁发日期", key:'issue_date', col:{wch:14}},
    {title:"发短信", key:'sms', col:{wch:8}},
]
let _headers_map = {}
for(let i in _headers){
    _headers_map[_headers[i].title] = _headers[i].key
}

export default {
    components:{
        Page,
        SMSDialog,
        ImportDialog
    },
    data(){
        return {
            bShowImportDialog:false,
            importColums:[
                {title:"申请编号", key:'cer_id', width:170},
                {title:"姓名", key:'name', width:80},
                {title:"联系方式", key:'phone', width:120},
                {title:"身份证号", key:'id_number', width:160},
                {title:"证书名称", key:'cer_name', width:300},
                {title:"证书编号", key:'cer_no', width:170},
                {title:"颁发机构", key:'issue_name', width:160},
                {title:"颁发日期", key:'issue_date', width:100},
                {title:"发短信", key:'sms', width:80},
            ],
            importDatas:[],
            bShowSMSDialog:false,
            smsIdNumbers:[],
            canImport:G_CheckAdminPermission(24),
            canExport:G_CheckAdminPermission(23),
            canSendSMS:G_CheckAdminPermission(3),
            searchDataOrderList:[
                {
                    label:"按申请时间",
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
            statusList:[
                {
                    "value" : -100,
                    "label" : "全部状态"
                },
                {
                    "value" : -1,
                    "label" : "未申请"
                },
                {
                    "value" : 0,
                    "label" : "通过"
                },
                {
                    "value" : 1,
                    "label" : "不通过"
                },
                {
                    "value" : 2,
                    "label" : "申请中"
                }
            ],
            paidStatusList:[
                {
                    "value" : -100,
                    "label" : "全部缴费状态"
                },
                {
                    "value" : 0,
                    "label" : "待缴费"
                },
                {
                    "value" : 1,
                    "label" : "已缴费"
                },
                {
                    "value" : 2,
                    "label" : "退款中"
                },
                {
                    "value" : 3,
                    "label" : "退款成功"
                },
                {
                    "value" : 4,
                    "label" : "退款失败"
                },
                {
                    "value" : 5,
                    "label" : "已过期"
                },
                {
                    "value" : -1,
                    "label" : "已删除"
                }
            ],
            searchCondition: {},
            searchConditionReal: {},
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
                                on: { click: () => { this.onCerDetail(params) }}
                            }, '详情')
                    }
                },
                { title: '基本信息', fixed: 'left', key: 'base_info', width: 170},
                { title: '头像', key: 'avatar', width: 130},
                { title: '证书名称', key: 'cer_name', width:300},
                { title: '证书编号', key: 'cer_no', width: 170},
                { title: '颁发机构', key: 'issue_name', width: 160},
                { title: '颁发日期', key: 'issue_date', width: 100},
                { title: '缴费', key: 'paid_info', width: 120 },
                { title: '状态', key: 'cer_status', width: 80},
                { title: '邮寄信息', key: 'mail_address', width: 200},
                { title: '申请时间', key: 'create_time', width:150 },
            ],
            cerDatas:[],
            pageCount:10,
            pageSize:40,
            currentPage:1,
            nextDisable:false,
            oriCerDatas:[],
            oriVirtualCerDatasCount:0
        }
    },
    methods:{
        makeUrl(){
            let url = req_user_cer_info
            url += "&id_number=" + this.searchConditionReal.id_number
            url += "&name=" + this.searchConditionReal.name
            url += "&cer_no=" + this.searchConditionReal.cer_no
            url += "&paid_status=" + this.searchConditionReal.paid_status
            url += "&cer_status=" + this.searchConditionReal.cer_status
            return url
        },
        makeItem(item){
            let id_number = item['id_number']
            if(this.user_datas_map[id_number]){
                let address = this.address_datas_map[item['address_id']]
                G_MergeMap(item, this.user_datas_map[id_number])
                
                item['create_time'] = G_GetLocalTime(item['create_time'], true)
                item['base_info'] = item['name'] + "<br><a target='_blank' href='#/User/Detail/" + item['id_number'] + "'>" + item['id_number'] + "</a><br>" + (item['sex']?"女":"男")
                if(address){
                    item['mail_address']  = address['address_province']+address['address_city']+address['address_area']+address['address_detail']+"<br>"+address['name']+"<br>"+address['phone_number']
                }
                
                if(item['head_img'])
                    item['avatar'] = "<img width=100 height=120 src="+item['head_img'] + ">"
                    
                switch(item['cer_status']){
                case -1:
                    item['cer_status'] = "<span style='color:black'>未申请</span>"
                    break
                case 0:
                    item['cer_status'] = "<span style='color:green'>通过</span>"
                    break;
                case 1:
                    item['cer_status'] = "<span style='color:red'>不通过</span>"
                    break
                case 2:
                    item['cer_status'] = "<span style='color:#5B00AE'>申请中</span>"
                    break
                }
                
                if(item['pay_id']){
                    item['paid_info'] = "应缴:" + (item['amount']/100) + "元<br>"
                    switch(item['paid_status']){
                    case -1:
                        item['paid_info'] += "已删除"
                        break
                    case 0:
                        item['paid_info'] += "待缴费"
                    case 1:
                        item['paid_info'] += "实缴:" + (item['amount']/100) + "元"
                        break
                    case 2:
                        item['paid_info'] += "退款中:" + (item['amount']/100) + "元"
                        break
                    case 3:
                        item['paid_info'] += "退款成功:" + (item['amount']/100) + "元"
                        break
                    case 4:
                        item['paid_info'] += "退款失败:" + (item['amount']/100) + "元"
                        break
                    case 5:
                        item['paid_info'] += "已过期"
                        break
                    default:
                        item['paid_info'] += "未知状态"
                        break
                    }
            
                    item['paid_info'] += "<br>"
                    switch(item['paid_channel']){
                    case 'wx_pub_qr':
                        item['paid_info'] += "微信支付"
                        break
                    default:
                        item['paid_info'] += "支付宝"
                        break
                    }
                }
            }
            return item
        },
        fetchCerDatas(more){
            let url = this.makeUrl()
            url += "&page_count=" + this.pageCount // 一次拉多少页
            url += "&page_size=" + this.pageSize
            url += "&page_current=" + (this.currentPage + (more ? 1 : 0))
            url += "&sort=" + this.searchConditionReal.sort
            url += "&need_total_count=1"
            this.$axios.get(url)    //请求的数据
            .then(result => {
                if(result && result.data && result.data.code == 200){
                    if(result.data.total_count != undefined){
                        this.oriVirtualCerDatasCount = result.data.total_count
                    }else{
                        this.oriVirtualCerDatasCount = 0
                    }
                    
                    this.cerDatas = []
                    if(result.data.cer.length < this.pageSize * this.pageCount){
                        // 后面再没有数据了
                        this.nextDisable = true
                        if(result.data.cer.length == 0){
                            if(more){
                                this.currentPage -= 1
                            }
                            this.onPageChange(this.currentPage)
                            return
                        }
                    }
                    
                    let user_datas = result.data.users
                    this.user_datas_map = {}
                    for(let i in user_datas){
                        let item = user_datas[i]
                        this.user_datas_map[item.id_number] = item
                    }
                    
                    let address_datas = result.data.address
                    this.address_datas_map = {}
                    for(let i in address_datas){
                        let item = address_datas[i]
                        this.address_datas_map[item.order_id] = item
                    }
                    
                    let cer_datas = result.data.cer
                    for(let i in cer_datas){
                        let item = cer_datas[i]
                        let flag = false
                        // 排重
                        for(let j in this.oriCerDatas){
                            if(item['cer_id'] === this.oriCerDatas[j]['cer_id']){
                                flag = true
                                break
                            }
                        }
                        if (flag) continue;
                        
                        item = this.makeItem(item)
                        if(item){
                            item.itemIndex = this.oriCerDatas.length
                            this.oriCerDatas.push(item)
                        }
                    }
                    
                    this.onPageChange(this.currentPage)
                }
            })
        },
        onResetSearchCondition(){
            this.searchCondition = {
                cer_status: 2,
                name:'',
                id_number:'',
                cer_no:'',
                paid_status:-100,
                sort:"create_time_desc",
            }
        },
        onSearch(){
            // 非追加模式
            this.currentPage = 1
            this.nextDisable = false
            this.oriCerDatas = []
            this.cerDatas = []
            
            this.searchConditionReal = G_DeepCopy(this.searchCondition)
            
            this.fetchCerDatas(false)
        },
        onTableSelectionChange(array){
            for(let i in this.cerDatas){
                this.cerDatas[i]._checked = false
            }
            for(let i in array){
                this.oriCerDatas[array[i].itemIndex]._checked = true
            }
        },
        onSendSMS(){
            let id_numbers = []
            for(let i in this.oriCerDatas){
                let item = this.oriCerDatas[i]
                if(item._checked)
                    id_numbers.push(item.id_number)
            }
            if(id_numbers.length == 0){
                this.$Message.error("请至少选择一项！")
                return
            }
            this.smsIdNumbers = id_numbers
            
            this.bShowSMSDialog = true
        },
        importPreview(file){
            let self = this
            G_ImportDataFromXLSX(file, _headers_map, function(datas){
                self.importDatas = datas
                self.bShowImportDialog = true
            })
            return false
        },
        onImportPost(){
            let _keys = ["cer_id", "cer_name", "cer_no", "issue_name", "issue_date", "sms", "phone", "name"]
            let items = []
            for(let i in this.importDatas){
                let data = this.importDatas[i]
                let item = {}
                for(let j in _keys){
                    item[_keys[j]] = data[_keys[j]]
                }
                items.push(item)
            }
            this.$axios.post(req_user_cer_import, {"items":items})
            .then(result => {
                if(result && result.data && result.data.code == 200){
                    this.onSearch()
                    this.$Message.success("录入成功")
                }else{
                    this.$Message.error("录入失败")
                }
            })
        },
        exportCerDatas(){
            let url = this.makeUrl() 
            url += "&unlimit=true"
            this.$axios.get(url)
            .then(result => {
                if(result && result.data && result.data.code == 200){
                    let user_datas = result.data.users
                    let user_datas_map = {}
                    for(let i in user_datas){
                        let item = user_datas[i]
                        user_datas_map[item.id_number] = item
                    }
                    
                    let address_datas = result.data.address
                    let address_datas_map = {}
                    for(let i in address_datas){
                        let item = address_datas[i]
                        address_datas_map[item.order_id] = item
                    }
                    
                    let out_datas = []
                    let cer_datas = result.data.cer
                    for(let i in cer_datas){
                        let item = cer_datas[i]
                        let user = user_datas_map[item['id_number']]
                        user = user ? user : {}
                        let address = address_datas_map[item['address_id']]?address_datas_map[item['address_id']]:{}
                        let data = {
                            cer_id:item['cer_id'],  // 申请编号
                            id_number:item['id_number'],    // 身份证号
                            name:user['name'], // 姓名
                            phone:user['phone_number'], // 联系方式
                            cer_name:item['cer_name'],  // 证书名称
                            province:user['address_province'],  // 省份
                            address:address['address_province']+address['address_city']+address['address_area']+address['address_detail'],  // 收件地址
                            address_name:address['name'],   // 收件人
                            address_phone:address['phone_number'],  // 收件人电话
                            address_zipcode:address['zipcode'], // 邮编
                            sms:'是',
                            issue_name:item['issue_name'],
                            issue_date:item['issue_date'],
                            cer_no:item['cer_no']
                        }
                        out_datas.push(data)
                    }
                    G_ExportDataToXLSX(_headers, out_datas)
                }
            })
        },
        onPageChange(page){
            this.currentPage = page
            this.cerDatas = this.oriCerDatas.slice((page-1)*this.pageSize, page*this.pageSize)
        },
        onBeforeNextLoad(obj, value){
            this.fetchCerDatas(true)
            return false
        },
        checkCanEdit(){
            // 不具审核权限的，不展示操作栏
            if(!this.canSendSMS){
                this.columns.splice(0, 1)
            }
        },
        onCerDetail(index){
            window.open('#/CerManager/Detail/'+index.row.cer_id, '_blank')
        }
    },
    created () {
        this.$emit('fMenuSeleted'); // 更新父组件的面包屑
        this.onResetSearchCondition()
        this.checkCanEdit()
        this.onSearch()
    }
}
</script>

<style scoped>
    .maindiv_inputb{
        opacity:0;
        position:absolute;
        left:0;
        width:100%;
        height:32px;
        margin-top:-7px;
    }
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
    img{
        padding-top: 5px;
    }
    .ivu-date-picker{
        display: inline-block;
    }
    .ivu-upload{
        display: inline-block;
    }
</style>
