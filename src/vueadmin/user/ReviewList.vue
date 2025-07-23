<template>
    <div>
        <div class="affix-top">
            <div>
                <Input placeholder="姓名" class="w80" v-model=searchCondition.name ></Input>
                <Input placeholder="身份证" class="w150" v-model=searchCondition.id ></Input>
                <Input placeholder="手机号" class="w100" v-model=searchCondition.phone ></Input>
                <Input placeholder="邮箱" class="w150" v-model=searchCondition.email ></Input>
                <Input placeholder="考试批次" class="w100" v-model=searchCondition.apply_exam_time_id ></Input>
                <Select v-model="searchCondition.sort" class="w100">
                    <Option-group v-for="group in searchDataOrderList" :label="group.label">
                        <Option v-for="order in group.orders" :value="order.value" :key="order">{{order.label}}</Option>
                    </Option-group>
                </Select>
                <Button type="info" @click="onSearch" icon="search">筛选</Button>
                <Button @click="onResetSearchCondition">重置条件</Button>
                <p class="mt10"></p>
                <Select v-model="searchCondition.status" class="w100">
                  <Option v-for="item in statusList" :value="item.value" :key="item">{{ item.label }}</Option>
                </Select>
                <Select v-model="searchCondition.paid_status" class="w150">
                  <Option v-for="item in paidStatusList" :value="item.value" :key="item">{{ item.label }}</Option>
                </Select>
                <Select v-model="searchCondition.exam_status" class="w150">
                  <Option v-for="item in examStatusList" :value="item.value" :key="item">{{ item.label }}</Option>
                </Select>
                <Select v-model="searchCondition.cer_apply_status" class="w100">
                  <Option v-for="item in cerApplyStatusList" :value="item.value" :key="item">{{ item.label }}</Option>
                </Select>
                <Date-picker type="datetimerange" placeholder="选择申请时间范围" style="width: 280px" v-model="searchCondition.apply_time_range"></Date-picker>
            </div>

            <div class="mt10">
                <!-- <Button type="info" @click="onBatchTraining">批量已培训</Button> -->
                <Button v-show="canVerify" type="info" @click="onBatchPass">批量通过</Button>
                <Button v-show="canVerify" type="info" @click="onBatchNopass">批量不通过</Button>
                <Button v-show="canSendSMS" type="info" @click="onSendSMS" icon="android-textsms">发短信</Button>
                <Button v-show="canExport" @click="exportApplyDatas" icon="ios-cloud-download-outline">导出</Button>
                <Upload action="" :before-upload="importScorePreview" v-show="canImportScore">
                    <Button icon="ios-cloud-upload-outline">成绩导入</Button>
                </Upload>
            </div>
            
            <Page show-total :virtual_total="oriVirtualApplyDatasCount" :total="oriApplyDatas.length" :current="currentPage" :nextDisable="nextDisable" show-elevator @on-change="onPageChange" :pageSize="pageSize" :beforeNextLoad="onBeforeNextLoad"  class="affix-top mt10"></Page>
        </div>
            
        <Table border :columns="columns" size="small" :data="applyDatas" class="mt10" @on-sort-change="onTableSort" @on-selection-change="onTableSelectionChange" height="600"></Table>
        
        <Modal v-model="bShowNoPassDialog" width="450">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>{{dialogTitle}}</span>
            </p>
            <div style="text-align:center">
                <p style="text-align: left; font-size: 16px; color:#000;">请写明原因，以便用户知悉:</p>
                <Input v-model="noPassDialogReason" type="textarea" :rows="4" placeholder="请输入..."></Input>
                <br><br>
                <p style="text-align: left;">
                    常用拒绝理由:
                    <Select ref="refNormalReasonSelect" @on-select-selected="onNormalReasonSelected">
                      <Option v-for="value in normalReasonList" :value="value" :key="value">{{ value }}</Option>
                    </Select>
                    <br><br>
                    <Checkbox v-model="bSendSms">短信通知</Checkbox>
                </p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long  @click="onDialogConfirm">确认</Button>
            </div>
        </Modal>
        
        <Modal v-model="bShowPassDialog" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>{{dialogTitle}}</span>
            </p>
            <div style="text-align:center">
                <Checkbox v-model="bSendSms">短信通知</Checkbox>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long  @click="onDialogConfirm">确认</Button>
            </div>
        </Modal>
        
        <SMSDialog v-model="bShowSMSDialog" :id_numbers="smsIdNumbers"></SMSDialog>
        <ImportDialog v-model="bShowImportDialog" :columns="importColums" :data="importDatas" :onOK="onImportPost"></ImportDialog>
    </div>
</template>

<script>
import Page from '../../components/plugins/page';
import SMSDialog from '../../components/plugins/sms/SMSDialog.vue';
import ImportDialog from '../../components/plugins/importdialog/ImportDialog.vue';

let _headers = [
    {title:"申请编号", key:'apply_id', col:{wch:20}},
    {title:"准考证号", key:'exam_id', col:{wch:20}},
    {title:"姓名", key:'name', col:{wch:10}},
    {title:"身份证号", key:'id_number', col:{wch:24}},
    {title:"省份", key:'province', col:{wch:10}},
    {title:"联系地址", key:'address', col:{wch:58}},
    {title:"联系方式", key:'phone', col:{wch:14}},
    {title:"考试科目", key:'exam', col:{wch:60}},
    {title:"科目ID", key:'product_id', col:{wch:16}},
    {title:"考试批次", key:'exam_time_id', col:{wch:16}},
    {title:"考试地点", key:'exam_location', col:{wch:24}},
    {title:"考试开始时间", key:'exam_time_start', col:{wch:20}},
    {title:"考试结束时间", key:'exam_time_end', col:{wch:20}},
    {title:"是否通过", key:'ispass', col:{wch:10}},
    {title:"发短信", key:'sms', col:{wch:8}},
]
let _score_headers_map = {}
for(let i in _headers){
    _score_headers_map[_headers[i].title] = _headers[i].key
}
let _score_colums = [
    {title:"申请编号", key:'apply_id', width:160},
    {title:"准考证号", key:'exam_id', width:160},
    {title:"姓名", key:'name', width:100},
    {title:"身份证号", key:'id_number', width:160},
    {title:"联系方式", key:'phone', width:120},
    {title:"考试科目", key:'exam', width:160},
    {title:"科目ID", key:'product_id', width:80},
    {title:"考试批次", key:'exam_time_id', width:120},
    {title:"是否通过", key:'ispass', width:90},
    {title:"发短信", key:'sms', width:70}
]

export default {
    components:{
        Page,
        SMSDialog,
        ImportDialog
    },
    data () {
        return {
            bShowImportDialog: false,
            importColums:_score_colums,
            importDatas:[],
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
            nextDisable: false,
            tableSortedKey: "create_time",
            tableSortedOrder: "normal",
            pageCount: 10,
            pageSize: 40,
            currentPage: 1,
            pageSizeList:[10, 20, 30, 40],
            normalReasonList:[
                "请上传标准证件照，勿上传自拍照，以免影响证书制作",
                "请上传标准证件照，勿上传翻拍照，以免影响证书制作",
                "请上传标准证件照，勿上传身份证照，以免影响证书制作",
                "上传的照片清晰度不达标，请上传标准证件照，以免影响证书制作",
                "上传的照片非标准尺寸，请上传标准证件照，以免影响证书制作",
                "请上传本人真实照片，以免影响证书制作",
                "所填写的基本信息有误，请填写个人真实信息",
                "性别与所填其他信息不符，请填写个人真实信息",
                "所填写的教育信息不完整，请填写个人完整信息",
                "所填写的工作信息不完整，请填写个人完整信息",
            ],
            cerApplyStatusList:[
                {
                    "value" : -100,
                    "label" : "全部"
                },
                {
                    "value" : 0,
                    "label" : "未申请证书"
                },
                {
                    "value" : 1,
                    "label" : "已申请证书"
                }
            ],
            statusList:[
                {
                    "value" : -100,
                    "label" : "全部状态"
                },
                {
                    "value" : 0,
                    "label" : "未审核"
                },
                {
                    "value" : 1,
                    "label" : "审核通过"
                },
                {
                    "value" : 2,
                    "label" : "审核不通过"
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
            examStatusList:[
                {
                    "value" : -100,
                    "label" : "全部"
                },
                {
                    "value" : -10,
                    "label" : "信息化+紧缺"
                },
                {
                    "value" : 0,
                    "label" : "未考试"
                },
                {
                    "value" : 1,
                    "label" : "考试通过"
                },
                {
                    "value" : 2,
                    "label" : "考试不通过"
                },
                {
                    "value" : 3,
                    "label" : "已考试待出成绩"
                }
            ],
            canImportScore:G_CheckAdminPermission(8),
            canExport:G_CheckAdminPermission(22),
            canSendSMS:G_CheckAdminPermission(3),
            bShowSMSDialog: false,
            smsIdNumbers:[],
            smsTemplateID: "",
            smsParamsKey1: "",
            smsParamsValue1: "",
            smsParamsKey2: "",
            smsParamsValue2: "",
            canVerify:G_CheckAdminPermission(5),
            bShowNoPassDialog: false,
            bShowPassDialog: false,
            noPassDialogReason:'',
            searchCondition: {},
            searchConditionReal: {},
            columns: [
                { type: 'selection', width: 50, fixed: 'left'},
                {
                    title: '操作',
                    fixed: 'left',
                    key: 'action',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        return (params.row._disabled_opt || params.row.apply_status != 0) ? '' : h('div', [
                            h('Button', {
                                props: { type: 'success', size: 'small' },
                                style: { width: '60px', marginTop: '5px'},
                                on: { click: () => { this.onPass(params) }}
                            }, '通过'),
                            h('Button', {
                                props: { type: 'error', size: 'small'},
                                style: { marginTop: '4px', marginBottom: '5px', width: '60px' },
                                on: { click: () => { this.onNopass(params) }}
                            }, '不通过')
                        ])
                    }
                },
                { title: '基本信息', fixed: 'left', key: 'base_info', width: 170},
                { title: '头像', key: 'avatar', width: 130},
                { title: '联系信息', key: 'address_info', width: 200 },
                { title: '教育信息', key: 'education_info', width: 200 },
                { title: '工作信息', key: 'work_info', width: 200 },
                { title: '科目信息', key: 'product_info', width: 180 },
                { title: '报考时间', key: 'create_time', width: 105 },
                { title: '缴费', key: 'paid_info', width: 120 },
                { title: '状态', key: 'apply_status_des', width: 140},
            ],
            applyDatas:[],
            oriApplyDatas:[],
            oriVirtualApplyDatasCount:0,
            dialogTitle:'',
            bSendSms:true,
        }
    },
    created () {
        this.$emit('fMenuSeleted'); // 更新父组件的面包屑
        this.onResetSearchCondition()
        
        let _tmp_ = G_GetStore("_tmp_apply_exam_time_id_")
        if(_tmp_){
            G_RemoveStore("_tmp_apply_exam_time_id_")
            this.searchCondition.apply_exam_time_id = _tmp_
        }
        _tmp_ = G_GetStore("_tmp_apply_status_")
        if(_tmp_){
            G_RemoveStore("_tmp_apply_status_")
            this.searchCondition.status = parseInt(_tmp_)
        }
        
        this.checkCanVerify()
        this.onSearch()
    },
    methods: {
        disableItem(item){
            // this.$set(item, "_disabled", true)
            this.$set(item, "_checked", false)
            this.$set(item, "_disabled_opt", true)
        },
        makeItem(item){
            let id_number = item['id_number']
            if(this.user_datas_map[id_number]){
                G_MergeMap(item, this.user_datas_map[id_number])
                
                item['email'] = (item['email'] && item['email'] !== 'None') ? item['email'] : ''
                item['base_info'] = item['name'] + "<br><a target='_blank' href='#/User/Detail/" + item['id_number'] + "'>" + item['id_number'] + "</a><br>" + (item['sex']?"女":"男") + "<br>" + item['racial']
                if(item['head_img'])
                    item['avatar'] = "<img width=100 height=120 src="+item['head_img'] + ">"
                
                item['address_info'] = item['phone_number'] + "<br>" + item['email']
                if(item['address_province'] && item['address_province'] !== 'None')
                    item['address_info'] += "<br>" + item['address_province']+"-"+item['address_city'] + "<br>" + item['address_detail']
                if(item['graduate_school'] && item['graduate_school'] !== 'None')
                    item['education_info'] = item['graduate_school'] + "<br>" + item['graduate_career'] + "<br>" + item['degree'] + "<br>" + item['graduate_time']
                if(item['work_company'] && item['work_company'] !== 'None')
                    item['work_info'] = item['work_company'] + "<br>" + item['work_title']
                
                item['product_info'] = ""
                for(let i in item['product_data']){
                    let data = this.product_datas_map[item['product_data'][i]['product_id']]
                    if(data['group_id'] === "info") item['product_info'] += "【信息化】";
                    else if(data['group_id'] === "rare") item['product_info'] += "【紧缺人才】";
                    else item['product_info'] += "【考试】";
                    item['product_info'] += data['product_des'] + "<br>"
                }
                if(item['apply_exam_time_id']){
                    let exam_time = this.exam_time_datas_map[item['apply_exam_time_id']]
                    item['product_info'] += G_GetLocalTime(exam_time['exam_time']) + " ~ " + G_GetLocalTime(exam_time['exam_time']+exam_time['exam_length']).split(' ')[1] + "<br>"
                }
                
                item['paid_info'] = "应缴:" + (item['amount']/100) + "元<br>"
                if(item['pay_id']){
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
                }else{
                    item['paid_info'] += "待缴费"
                }
                
                if(item['apply_status'] == 2){
                    item['apply_status_des'] = "<span style='color:red'>审核不通过</span><br>"+item['remark']
                    item['_disabled_opt'] = true
                }else if(item['apply_status'] == 1){
                    switch(item['exam_status']){
                    case 1:
                        item['apply_status_des'] = "<span style='color:blue'>考试通过</span>"
                        break
                    case 2:
                        item['apply_status_des'] = "<span style='color:#BB3D00'>考试不通过</span>"
                        break
                    case 3:
                        item['apply_status_des'] = "<span style='color:#5B00AE'>已考试待出成绩</span>"
                        break
                    default:
                        item['apply_status_des'] = "<span style='color:green'>审核通过</span>"
                        break
                    }
                    item['_disabled_opt'] = true
                }else{
                    item['apply_status_des'] = "<span style='color:orange'>未审核</span>"
                }
            }
            return item
        },
        requestVerifyApply(params, success_callback, faild_callback){
            params['bSendSms'] = this.bSendSms
            this.$axios.post(req_verify_user_apply, params).then(result => {
                if(result && result.data && result.data.code == 200){
                    if(success_callback) success_callback();
                }else{
                    if(faild_callback) faild_callback();
                }
            }).catch(e => {
                if(faild_callback) faild_callback();
            })
        },
        onSearch(){
            // 非追加模式
            this.currentPage = 1
            this.nextDisable = false
            this.oriApplyDatas = []
            this.applyDatas = []
            this.sortedApplyDatas = []
            
            this.searchConditionReal = G_DeepCopy(this.searchCondition)
            this.searchSort = this.searchConditionReal.sort
            
            if(this.searchConditionReal.apply_time_range){
                this.searchConditionReal.apply_time_start = G_DatetimeToTimeStamp(this.searchConditionReal.apply_time_range[0])
                this.searchConditionReal.apply_time_end = G_DatetimeToTimeStamp(this.searchConditionReal.apply_time_range[1])
            }else{
                this.searchConditionReal.apply_time_start = ''
                this.searchConditionReal.apply_time_end = ''
            }
            
            
            this.fetchApplyDatas(false)
        },
        exportApplyDatas(){
            let url = this.makeUrl() 
            url += "&unlimit=true"
            this.$axios.get(url)
            .then(result => {
                if(result && result.data && result.data.code == 200){
                    let user_datas = result.data.users
                    let user_datas_map = {}
                    for(let i in user_datas){
                        let item = user_datas[i]
                        item['address_province'] = item['address_province']&&item['address_province']!='None' ? item['address_province'] : ''
                        item['address_city'] = item['address_city']&&item['address_city']!='None' ? item['address_city'] : ''
                        item['address_area'] = item['address_area']&&item['address_area']!='None' ? item['address_area'] : ''
                        item['address_detail'] = item['address_detail']&&item['address_detail']!='None' ? item['address_detail'] : ''
                        user_datas_map[item.id_number] = item
                    }
                    
                    let exam_time_datas = result.data.exam_times
                    let exam_time_datas_map = {}
                    for(let i in exam_time_datas){
                        let item = exam_time_datas[i]
                        exam_time_datas_map[item['time_id']] = item
                    }
                    
                    let product_datas = result.data.products
                    let product_datas_map = {}
                    for(let i in product_datas){
                        let item = product_datas[i]
                        product_datas_map[item['product_id']] = item
                    }
                    
                    let out_datas = []
                    let apply_datas = result.data.apply
                    for(let i in apply_datas){
                        let item = apply_datas[i]
                        let user = user_datas_map[item['id_number']]
                        let data = {
                            id_number:item['id_number'],    // 身份证号
                            name:user['name'], // 姓名
                            province:user['address_province'],  // 省份
                            address:user['address_province']+user['address_city']+user['address_area']+user['address_detail'],  // 联系地址
                            phone:user['phone_number'], // 联系方式
                            exam_time_id:item['apply_exam_time_id'],   // 考试批次
                            apply_id:item['order_id'],  // 申请编号
                        }
                        let exam_time = exam_time_datas_map[item['apply_exam_time_id']]
                        if(exam_time){
                            data['exam_id'] = item['exam_id']   // 准考证号
                            data['exam_time_start'] = G_GetLocalTime(exam_time['exam_time'])   // 考试开始时间
                            data['exam_time_end'] = G_GetLocalTime(exam_time['exam_time']+exam_time['exam_length']) // 考试结束时间
                            data['exam_location'] = item['exam_location']   // 考试地点
                        }
                        data['product_id'] = []
                        data['exam'] = []
                        for(let j in item['product_data']){
                            let product = product_datas_map[item['product_data'][j]['product_id']]
                            data['product_id'].push(product['product_id'])
                            if(product['group_id'] == "info"){
                                data['exam'].push("全国工业和信息化应用人才测评证书 【" + product['product_des'] + "】") 
                            }else if(product['group_id'] == "rare"){
                                data['exam'].push("工业和信息化领域急需紧缺人才培养工程证书 【" + product['product_des'] + "】") 
                            }else{
                                data['exam'].push(product['product_des']) // 考试科目
                            }
                        }
                        data['product_id'] = data['product_id'].join(String.fromCharCode(10))
                        data['exam'] = data['exam'].join(String.fromCharCode(10))
                        out_datas.push(data)
                    }
                    
                    G_ExportDataToXLSX(_headers, out_datas)
                }
            })
        },
        makeUrl(){
            let url = req_user_apply_info 
            url += "&apply_status=" + this.searchConditionReal.status
            url += "&id_number=" + this.searchConditionReal.id
            url += "&name=" + this.searchConditionReal.name
            url += "&phone_number=" + this.searchConditionReal.phone
            url += "&email=" + this.searchConditionReal.email
            url += "&apply_exam_time_id=" + this.searchConditionReal.apply_exam_time_id
            url += "&paid_status=" + this.searchConditionReal.paid_status
            url += "&exam_status=" + this.searchConditionReal.exam_status
            url += "&cer_apply_status=" + this.searchConditionReal.cer_apply_status
            url += "&apply.create_time_start=" + this.searchConditionReal.apply_time_start
            url += "&apply.create_time_end=" + this.searchConditionReal.apply_time_end
            return url
        },
        fetchApplyDatas(more){
            let url = this.makeUrl() 
            url += "&page_count=" + this.pageCount // 一次拉多少页
            url += "&page_size=" + this.pageSize
            url += "&page_current=" + (this.currentPage + (more ? 1 : 0))
            url += "&sort=" + this.searchSort
            url += "&need_total_count=1"
            this.$axios.get(url)    //请求的数据
            .then(result => {
                if(result && result.data && result.data.code == 200){
                    if(result.data.total_count != undefined){
                        this.oriVirtualApplyDatasCount = result.data.total_count
                    }else{
                        this.oriVirtualApplyDatasCount = 0
                    }
                    
                    this.applyDatas = []
                    if(result.data.apply.length < this.pageSize * this.pageCount){
                        // 后面再没有数据了
                        this.nextDisable = true
                        if(result.data.apply.length == 0){
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
                        // 去掉时分秒
                        if(item['graduate_time'])
                            item['graduate_time'] = item['graduate_time'].split(' ')[0]
                        if(item['create_time'])
                            item['create_time'] = item['create_time'].split(' ')[0]
                        this.user_datas_map[item.id_number] = item
                    }
                    
                    let product_datas = result.data.products
                    this.product_datas_map = {}
                    for(let i in product_datas){
                        let item = product_datas[i]
                        this.product_datas_map[item['product_id']] = item
                    }
                    
                    let exam_time_datas = result.data.exam_times
                    this.exam_time_datas_map = {}
                    for(let i in exam_time_datas){
                        let item = exam_time_datas[i]
                        this.exam_time_datas_map[item['time_id']] = item
                    }
                    
                    let apply_datas = result.data.apply
                    for(let i in apply_datas){
                        let item = apply_datas[i]
                        let flag = false
                        // 排重
                        for(let j in this.oriApplyDatas){
                            if(item['order_id'] === this.oriApplyDatas[j]['order_id']){
                                flag = true
                                break
                            }
                        }
                        if (flag) continue;
                        
                        item = this.makeItem(item)
                        if(item){
                            item.itemIndex = this.oriApplyDatas.length
                            this.oriApplyDatas.push(item)
                            this.sortedApplyDatas.push(item)
                        }
                    }
                    
                    this.onTableSort({
                        key: this.tableSortedKey,
                        order: this.tableSortedOrder
                    })
                }
            })
        },
        checkCanVerify(){
            // 不具审核权限的，不展示操作栏
            if(!this.canVerify){
                this.columns.splice(1, 1)
                if(!this.canSendSMS){
                    this.columns.splice(0, 1)
                }
            }
        },
        pass(item){
            item.apply_status_des = "<span style='color:green'>审核通过</span>"
            this.disableItem(item)
            this.passNotice(item.name)
        },
        nopass(item){
            this.disableItem(item)
            item['reason'] = this.noPassDialogReason
            item['apply_status_des'] = "<span style='color:red'>审核不通过</span><br>"+item['reason']
            this.nopassNotice(item['name'])
        },
        passNotice (name) {
            this.$Notice.success({
                title: name + '-审核通过'
            });
        },
        nopassNotice (name){
            this.$Notice.info({
                title: name + '-审核不通过'
            });
        },
        onDialogConfirm(){
            this.bShowNoPassDialog = false
            this.bShowPassDialog = false
            if(this.onDialogConfirmFunc){
                this.onDialogConfirmFunc()
            }
        },
        onBatchNopass(){ //批量不通过
            let flag = false
            for(let i in this.oriApplyDatas){
                if(this.oriApplyDatas[i]._disabled_opt){
                    continue
                }
                if(this.oriApplyDatas[i]._checked){
                    flag = true
                    break
                }
            }
            if(!flag){
                this.$Message.error("请至少选择一项未处理过的！")
                return
            }
            
            this.noPassDialogReason = ''
            this.bShowNoPassDialog = true
            this.bSendSms = true
            this.dialogTitle = '批量审核不通过'
            this.$refs.refNormalReasonSelect.clearSingleSelect()
            this.onDialogConfirmFunc = this.onBatchNopassConfirm
        },
        onNopass(index){ //审核不通过
            this.nopassIndex = index.row.itemIndex
            this.noPassDialogReason = ''
            this.bShowNoPassDialog = true
            this.bSendSms = true
            this.dialogTitle = '审核不通过'
            this.$refs.refNormalReasonSelect.clearSingleSelect()
            this.onDialogConfirmFunc = this.onNopassConfirm
        },
        onResetSearchCondition(){
            this.searchCondition = {
                status: 0,
                name:'',
                id:'',
                phone:'',
                email:'',
                paid_status:1,
                exam_status:-100,
                cer_apply_status:-100,
                sort:"create_time_desc",
                apply_exam_time_id:''
            }
        },
        // onBatchTraining(){  //批量已培训
        //
        // },
        onBatchPass(){  //批量通过
            let flag = false
            for(let i in this.oriApplyDatas){
                if(this.oriApplyDatas[i]._disabled_opt){
                    continue
                }
                if(this.oriApplyDatas[i]._checked){
                    flag = true
                    break
                }
            }
            if(!flag){
                this.$Message.error("请至少选择一项未处理过的！")
                return
            }
            
            this.bSendSms = true
            this.dialogTitle = '批量审核通过'
            this.bShowPassDialog = true
            this.onDialogConfirmFunc = this.onBatchPassConfirm
        },
        onPass (index) { //审核通过
            this.bSendSms = true
            this.dialogTitle = '审核通过'
            this.bShowPassDialog = true
            this.passIndex = index.row.itemIndex
            this.onDialogConfirmFunc = this.onPassConfirm
        },
        onBatchNopassConfirm(){
            let order_ids = []
            for(let i in this.oriApplyDatas){
                let item = this.oriApplyDatas[i]
                if(item._disabled_opt){
                    continue
                }
                if(item._checked){
                    order_ids.push(item.order_id)
                    this.nopass(item)
                }
            }
            
            let self = this
            this.requestVerifyApply(
                {
                    "order_ids": order_ids,
                    "apply_status":2,
                    "remark":this.noPassDialogReason
                }
            )
        },
        onNopassConfirm(){
            let self = this
            let item = this.oriApplyDatas[this.nopassIndex]
            self.nopass(item)
            
            this.requestVerifyApply(
                {
                    "order_ids": [item.order_id],
                    "apply_status":2,
                    "remark":this.noPassDialogReason
                }
            )
        },
        onBatchPassConfirm(){
            let order_ids = []
            for(let i in this.oriApplyDatas){
                let item = this.oriApplyDatas[i]
                if(item._disabled_opt){
                    continue
                }
                if(item._checked){
                    order_ids.push(item.order_id)
                    this.pass(item)
                }
            }
    
            this.requestVerifyApply(
                {
                    "order_ids": order_ids,
                    "apply_status":1
                }
            )
        },
        onPassConfirm(){
            let item = this.oriApplyDatas[this.passIndex]
            this.pass(item)
            
            this.requestVerifyApply(
                {
                    "order_ids": [item.order_id],
                    "apply_status":1
                }
            )
        },
        onSendSMS(){
            let id_numbers = []
            for(let i in this.oriApplyDatas){
                let item = this.oriApplyDatas[i]
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
        onNormalReasonSelected(value){
            this.noPassDialogReason = value
        },
        
        onTableSelectionChange(array){
            for(let i in this.applyDatas){
                this.applyDatas[i]._checked = false
            }
            for(let i in array){
                this.oriApplyDatas[array[i].itemIndex]._checked = true
            }
        },
        onTableSort(params){
            /*
            params = {
                column : object,    #当前列数据
                key : string,   # 排序依据的指标
                order : string, # 排序的顺序，值为 asc 或 desc 或normal
            }  
            //*/
            // if(params.order == "normal" && params.key == "create_time" && this.searchSort == "create_time_desc"){
            //     params.order = "desc"
            // }
            // this.tableSortedKey = params.key
            // this.tableSortedOrder = params.order
            // this.sortedApplyDatas.sort(function(a, b){
            //     if(params.order === 'desc'){
            //         return b[params.key].localeCompare(a[params.key])
            //     }else{
            //         return a[params.key].localeCompare(b[params.key])
            //     }
            // })
            this.onPageChange(this.currentPage)
        },
        onPageChange(page){
            this.currentPage = page
            this.applyDatas = this.sortedApplyDatas.slice((page-1)*this.pageSize, page*this.pageSize)
        },
        onBeforeNextLoad(obj, value){
            // if(this.tableSortedKey !== "create_time" && this.tableSortedOrder !== "normal"){
            //     this.$Message.error("排序状态下无法拉取更多数据")
            //     return true
            // }
            this.fetchApplyDatas(true)
            return false
        },
        importScorePreview(file){
            let self = this
            G_ImportDataFromXLSX(file, _score_headers_map, function(datas){
                self.importDatas = datas
                self.bShowImportDialog = true
                self.onImportPost = function(){
                    let _keys = ["apply_id", "exam_id", "ispass", "sms", "id_number"]
                    let items = []
                    for(let i in datas){
                        let data = datas[i]
                        let item = {}
                        for(let j in _keys){
                            item[_keys[j]] = data[_keys[j]]
                        }
                        items.push(item)
                    }
                    self.$axios.post(req_user_score_import, {"items":items})
                    .then(result => {
                        if(result && result.data && result.data.code == 200){
                            self.$Message.success("成绩录入成功")
                        }else{
                            self.$Message.error("成绩录入失败")
                        }
                    })
                }
            })
            return false
        },
        onImportPost(){},
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
