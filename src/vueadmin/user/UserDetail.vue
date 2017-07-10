<template>
    <div>
        <Tabs type="card" :animated="false">
            <Tab-pane label="个人信息">
                 <div>
                     <i-form ref="form" :model="form" :rules="ruleValidate" id="form" :label-width="100" label-position="right">
                         <Row style="position:absolute;  margin-left:250px;z-index:1;">
                             <Row>
                                  <img style="height:120px;width:100px;" :src="form.head_img">
                             </Row>
                             <Row >
                                 <Button type="primary" size="large" @click="onUploadHeader" :disabled="!canEdit">上传证件照</Button>
                             </Row>
                         </Row>
                         <Form-item label="身份证号:" style="width: 35%;">
                             {{form.id_number}}
                         </Form-item>
                         <Form-item label="注册时间:" style="width: 35%;">
                             {{form.create_time}}
                         </Form-item>
                         <Form-item label="姓名:" style="width: 35%;">
                             {{form.name}}
                         </Form-item>
                         <Form-item label="性别:" prop="sex" style="width: 35%;">
                             <Radio-group v-model="form.sex">
                                 <Radio v-for="sex in sexRadio" :label="sex.value" :disabled="!canEdit">
                                     <span>{{sex.label}}</span>
                                 </Radio>
                             </Radio-group>
                         </Form-item>
                         <Form-item label="出生日期:" style="width: 35%;">
                             {{form.birth}}
                         </Form-item>
                         <Form-item label="手机号码:" prop="phone_number" style="width: 35%;">
                             <Input size="large" v-model="form.phone_number" :disabled="!canEdit"></Input>
                             <Button v-show="canSendSMS" type="info" @click="onSendSMS" icon="android-textsms">发短信</Button>
                         </Form-item>
                         <Form-item label="电子邮箱:" prop="email" style="width: 35%;">
                             <Input size="large" v-model="form.email" :disabled="!canEdit"></Input>
                         </Form-item>
                         <Form-item label="民族:" prop="racial" style="width: 35%;">
                             <Select v-model="form.racial" style="width:200px" :disabled="!canEdit">
                                 <Option v-for="item in racialList" :value="item" :key="item">{{ item }}</Option>
                             </Select>
                         </Form-item>
                         <Form-item label="是否已毕业:" prop="graduate" style="width: 35%;">
                             <Radio-group v-model="form.graduate">
                                 <Radio v-for="radio in radioList" :label="radio.value" :disabled="!canEdit">
                                     <span>{{radio.label}}</span>
                                 </Radio>
                             </Radio-group>
                         </Form-item>
                         <Form-item label="最高学历:" prop="degree" style="width: 35%;">
                             <Select v-model="form.degree" style="width:200px" :disabled="!canEdit">
                                 <Option v-for="degree in degreeList" :value="degree" :key="degree">{{ degree }}</Option>
                             </Select>
                         </Form-item>
                         <Form-item label="学校名称:" prop="graduate_school" style="width: 35%;">
                             <Input size="large" v-model="form.graduate_school" :disabled="!canEdit"></Input>
                         </Form-item>
                         <Form-item label="毕业时间:" prop="graduate_time" style="width: 35%;">
                             <Date-picker v-model="form.graduate_time" type="date" placeholder="选择日期" style="width: 200px" :disabled="!canEdit"></Date-picker>
                         </Form-item>
                         <Form-item label="所学专业:" prop="graduate_career" style="width: 35%;">
                             <Input size="large" v-model="form.graduate_career" :disabled="!canEdit"></Input>
                         </Form-item>
                         <Form-item label="通迅地址:">
                              <Select v-model="form.address_province" :disabled="!canEdit" @on-change="onChangeProvince" class="w100">
                                 <Option v-for= "item in province_city_map" :value="item.p" :label="item.p">{{item.p}}</Option>
                             </Select>
                             <Select v-model="form.address_city" :disabled="!canEdit" @on-change="onChangeCity" class="w100">
                                 <Option  v-for= "item in cur_city_list" :value="item.n" :label="item.n">{{item.n}}</Option>
                             </Select>
                             <Select v-model="form.address_area" :disabled="!canEdit"  class="w100">
                                 <Option  v-for= "item in cur_area_list" :value="item.s" :label="item.s">{{item.s}}</Option>
                             </Select>
                             <br>
                         </Form-item>
                         <Form-item prop="address_detail" style="width: 35%;">
                             <Input size="large" v-model="form.address_detail" :disabled="!canEdit"></Input>
                         </Form-item>
                         <Form-item label="工作单位:" prop="work_company" style="width: 35%;">
                             <Input size="large" v-model="form.work_company" :disabled="!canEdit"></Input>
                         </Form-item>
                         <Form-item label="职务:" prop="work_title" style="width: 35%;">
                             <Input size="large" v-model="form.work_title" :disabled="!canEdit"></Input>
                         </Form-item>
                     </i-form>
                 </div>
        
                 <div>
                      <Modal
                         v-model="showUploadFlag"
                         @on-ok="onClickedUploadHeadOk"
                         ok-text="上传">
                          <p slot="header" style="text-align:left">
                            <span>上传头像</span>
                          </p>
                          <div>
                             <Row class="MainItem">
                                 <Col span="24" class="main_right">
                                     <div style="width:100%; position:relative;overflow:hidden;height:40px;float:left">
                                         <Input placeholder="请选择图片" v-model="user_head_name" style="position:absolute; left:0;width:75%;height:100%;" ></Input>
                                         <Button style="width:23%;height:80%; float:right;" type="primary" icon="checkmark-round" >
                                             选择图片
                                         </Button>
                                         <input type="file" :id="user_head_id" @change="onFileChange" style="opacity:0;position:absolute; left:0;width:100%;height:100%;" accept="image/jpeg,image/jpg,image/png"></input>
                                     </div>
                                 </Col>
                             </Row>
                              <Row class="MainItem">
                                 <Col span="24" class="main_right">
                                       <img style="width:100%;height:100%;" :src="upload_tip">
                                 </Col>
                             </Row>
                              <Row class="MainItem">
                                 <Col span="24" class="main_right">
                                  <ul class="help-block">
                                      <li>
                                          1、请上传近期免冠证件照，确保照片清晰，请勿使用生活照、自拍照、身份证照、证件照翻拍等，以免影响证书制作；
                                      </li>
                                      <li>
                                          2、照片格式为.jpg, .png, .jpeg的图片，图片尺寸大小在500×900范围内，文件大小不超过2M。
                                      </li>
                                  </ul>
                                 </Col>
                             </Row>
                          </div>
                     </Modal>
                 </div>
        
                 <SMSDialog v-model="bShowSMSDialog" :id_numbers="smsIdNumbers"></SMSDialog>
        
                 <goback :confirm="canEdit" okMsg="您已放弃此次更改" cancelMsg=""></goback>
                 <!-- <Button v-show="canEdit" type="primary" @click="onDelete" style="position: relative;left: 100px;">删除</Button> -->
                 <Button v-show="canEdit" type="warning" @click="onModify" style="position: relative;left: 100px;">保存修改</Button>
            </Tab-pane>
            <Tab-pane label="申请数据">
                 <Table border :columns="apply_columns" size="small" :data="applyDatas" class="mt10"></Table>
            </Tab-pane>
            <Tab-pane label="证书数据">
                <Table border :columns="cer_columns" size="small" :data="cerDatas" class="mt10"></Table>
            </Tab-pane>
        </Tabs>
    </div>
</template>

<script>
require('../../components/common/config/city.min.js')
import goback from '../../components/common/trick/goback.vue';
import SMSDialog from '../../components/plugins/sms/SMSDialog.vue';
import md5 from 'blueimp-md5'

export default {
    components:{
        goback,
        SMSDialog
    },
    data(){
        return {
            user_head_id:"user_head_id",
            user_head_name:'',
            upload_tip:G_cdn_img_path+"upload_tip.jpg",
            showUploadFlag:false,
            province_city_map:G_citylist,
            cur_city_list:[],
            cur_area_list:[],
            sexRadio:[
                {
                    "value": 0,
                    "label":'男'
                },
                {
                    "value": 1,
                    "label":'女'
                }
            ],
            radioList:[
                {
                    "value": 0,
                    "label":'是'
                },
                {
                    "value": 1,
                    "label":'否'
                }
            ],
            degreeList:["博士","硕士","本科","大专","其他"],
            racialList:["汉族","蒙古族","回族","藏族","维吾尔族","苗族","彝族","壮族","布依族","朝鲜族","满族","侗族","瑶族","白族","土家族","哈尼族","哈萨克族","傣族","黎族","僳僳族","佤族","畲族","高山族","拉祜族","水族","东乡族","纳西族","景颇族","柯尔克孜族","土族","达斡尔族","仫佬族","羌族","布朗族","撒拉族","毛南族","仡佬族","锡伯族","阿昌族","普米族","塔吉克族","怒族","乌孜别克族","俄罗斯族","鄂温克族","德昂族","保安族","裕固族","京族","塔塔尔族","独龙族","鄂伦春族","赫哲族","门巴族","珞巴族","基诺族","其他"],
            canSendSMS:G_CheckAdminPermission(3),
            canEdit:G_CheckAdminPermission(2),
            bShowSMSDialog: false,
            smsIdNumbers:[],
            id_number:'',
            form:{sex:0},
            ruleValidate:{
                phone_number:[{pattern:regExpPhone, message:"手机号码格式有误"}],
                email:[{pattern:regEmail, message:"邮箱格式有误"}]
            },
            apply_columns:[
                { title: '申请编号', key: 'order_id', width: 160},
                { title: '科目信息', key: 'product_info' },
                { title: '申请时间', key: 'create_time' },
                { title: '缴费', key: 'paid_info', width: 120 },
                { title: '状态', key: 'apply_status_des', width: 140}
            ],
            applyDatas:[],
            cer_columns:[
                { title: '申请编号', key: 'cer_id', width: 170},
                { title: '证书编号', key: 'cer_no', width: 170},
                { title: '证书名称', key: 'cer_name', width: 300},
                { title: '颁发机构', key: 'issue_name', width: 160},
                { title: '颁发日期', key: 'issue_date', width: 100},
                { title: '缴费', key: 'paid_info', width: 120 },
                { title: '状态', key: 'cer_status', width: 80},
                { title: '邮寄信息', key: 'mail_address', width: 200},
                { title: '申请时间', key: 'create_time', width:150 },
            ],
            cerDatas:[]
        }
    },
    methods:{
        onFileChange(){
            let self = this
            var files = event.target.files, file;
            if (files && files.length > 0) {
                let file = files[0]
                let file_name = file.name
                // 判断图片大小
                if(file.size > 2*1024*1024){
                    self.$Modal.error({
                         title: "温馨提示",
                         content:'<span style="font-size:15px;float:left">图片大小不得超过2M！</span>'
                    });
                    return
                }
                // 判断图片宽度
                var URL = window.URL || window.webkitURL;
                var imgURL = URL.createObjectURL(file);
                let image = new Image()
                image.src = imgURL
                setTimeout(function(){
                    if(image.width>500 || image.height>900){
                        self.$Modal.error({
                             title: "温馨提示",
                             content:'<span style="font-size:15px;float:left">图片尺寸在500x900内！</span>'
                        });
                    }else{
                        self.user_head_name = file_name
                    }
                },10)
            }
        },
        check_is_can_upload_head(){
            if(!/\.(jpg|jpeg|png)$/.test(this.user_head_name.toLowerCase())){
               this.$Modal.error({
                    title: "温馨提示",
                    content:'<span style="font-size:15px;float:left">仅支持jpg,jpeg,png格式图片！</span>'
               });
               return false
            }
            return true
        },
        onClickedUploadHeadOk(){
            if (this.check_is_can_upload_head() == false){
                return
            }
            var self = this;
            this.$axios.get(req_get_oss_config)
            .then(result => {
                if(result && result.data && result.data.code == 200){
                    var ret_data = result.data.data
                    var url_preix_ = ret_data['user-bucket-url']
                    var client = new OSS.Wrapper({
                        region:ret_data['region'],
                        accessKeyId:ret_data['accessKeyId'],
                        accessKeySecret:ret_data['accessKeySecret'],
                        bucket:ret_data['bucket']
                    })
                    var files = document.getElementById(self.user_head_id);
                    if(files.files){
                        var fileLen = document.getElementById(self.user_head_id).files
                        if (fileLen.length > 0){
                            var resultUpload = [];
                            var file = fileLen[0];
                            //修改文件名 防止冲突
                            var file_name = file.name
                            var file_last_index = file_name.lastIndexOf('.')
                            var file_last = ".jpg"
                            if (file_last_index != -1){
                                file_last = file_name.substring(file_last_index,file_name.length)
                            }
                            var file_name_oss = "user_head/" + md5(file_name + Date.parse(new Date())) + file_last
                            client.multipartUpload(file_name_oss, file, {})
                            .then((results) => {
                                var user_info = {
                                    action:'update',
                                    id_number:self.form.id_number,
                                    head_img:G_cdn_domain+file_name_oss,
                                }
                                self.$axios.post(req_user_info_modify,user_info)
                                .then(result => {
                                    if(result && result.data && result.data.code == 200){
                                        self.form.head_img = user_info.head_img
                                        self.$Message.success("上传成功")
                                    }else{
                                        self.$Modal.error({
                                            title: "温馨提示",
                                            content:'<span style="font-size:15px;float:left">上传失败，请重新上传！</span>'
                                        });
                                    }
                                })
                                .catch(e => {
                                    self.$Modal.error({
                                            title: "温馨提示",
                                            content:'<span style="font-size:15px;float:left">上传失败，请重新上传！</span>'
                                    });
                                })
                            }).catch((err) => {
                               self.$Modal.error({
                                    title: "温馨提示",
                                    content:'<span style="font-size:15px;float:left">上传失败，请重新上传！</span>'
                               });
                            });
                        }
                    }
                }
            })
        },
        onUploadHeader(){
            this.showUploadFlag = true
        },
        onChangeProvince(address_province){
            this.cur_city_list = []
            //选出对应的市
            for (var i = 0; i < this.province_city_map.length; i ++){
                var  province_item = this.province_city_map[i]
                if (province_item['p'] == address_province){
                    this.cur_city_list = province_item['c']
                    break
                }
            }
            if (this.first_select_address == false){
                this.form.address_city = ""
                this.form.address_area = ""
            }
        },
        onChangeCity(address_city){
            this.cur_area_list = []
            //选出对应的市
            for (var i = 0; i < this.cur_city_list.length; i ++){
                var  city_item = this.cur_city_list[i]
                if (city_item['n'] == address_city){
                    this.cur_area_list = city_item['a']
                    break
                }
            }

            if (this.first_select_address == false){
                this.form.address_area = ""
            }
            this.first_select_address = false
        },
        onDelete(){
            let self = this
            self.$Modal.confirm({
                title: '确认删除？',
                onOk: () => {
                    self.$axios.post(req_user_info_modify, {action:"delete",id_number:self.id_number})
                    .then(result =>{
                        if(result && result.data && result.data.code == 200){
                            self.$Message.info('删除成功');
                            G_GoBack()
                        }else{
                            self.$Message.error('删除失败');
                        }
                    })
                },
                onCancel: () => {
                    self.$Message.info('您已取消删除');
                },
                content: `确认删除？`
            });
        },
        onModify(){
            let self = this
            self.$refs['form'].validate((valid) => {
                if (valid) {
                    let formData = G_DeepCopy(self.form)
                    formData['action'] = "update"
                    delete formData['create_time']
                    delete formData['name']
                    delete formData['birth']
                    formData['graduate_time'] = G_DatetimeToTimeStamp(formData['graduate_time'])
                    
                    self.$Modal.confirm({
                        title: '确认修改？',
                        onOk: () => {
                            self.$axios.post(req_user_info_modify, formData)
                            .then(result =>{
                                if(result && result.data && result.data.code == 200){
                                    self.$Message.info('修改成功');
                                }else{
                                    self.$Message.error('修改失败');
                                }
                            })
                        },
                        onCancel: () => {
                            self.$Message.info('您已取消修改');
                        },
                        content: `确认修改？`
                    });
                }
            });
        },
        onSendSMS(){
            this.bShowSMSDialog = true
        },
        parseApplyDatas(result){
            let product_datas = result.data.apply_datas.products
            this.product_datas_map = {}
            for(let i in product_datas){
                let item = product_datas[i]
                this.product_datas_map[item['product_id']] = item
            }
            
            let exam_time_datas = result.data.apply_datas.exam_times
            this.exam_time_datas_map = {}
            for(let i in exam_time_datas){
                let item = exam_time_datas[i]
                this.exam_time_datas_map[item['time_id']] = item
            }
            
            let apply_datas = result.data.apply_datas.apply
            for(let i in apply_datas){
                let item = apply_datas[i]
                
                item['product_info'] = ""
                for(let i in item['product_data']){
                    let data = this.product_datas_map[item['product_data'][i]['product_id']]
                    if(data['group_id'] === "info") item['product_info'] += "【信息化】";
                    else if(data['group_id'] === "rare") item['product_info'] += "【紧缺人才】";
                    else item['product_info'] += "【考试】";
                    item['product_info'] += "[ID:"+data['product_id']+"] " + data['product_des'] + "<br>"
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
                }else{
                    item['apply_status_des'] = "<span style='color:orange'>未审核</span>"
                }
            }
            this.applyDatas = apply_datas
        },
        parseCerDatas(result){
            let address_datas = result.data.cer_datas.address
            let address_datas_map = {}
            for(let i in address_datas){
                let item = address_datas[i]
                address_datas_map[item.order_id] = item
            }
            
            let cer_datas = result.data.cer_datas.cer
            for(let i in cer_datas){
                let item = cer_datas[i]
                let address = address_datas_map[item['address_id']]
                
                if(address){
                    item['mail_address']  = address['address_province']+address['address_city']+address['address_area']+address['address_detail']+"<br>"+address['name']+"<br>"+address['phone_number']
                }
                
                item['create_time'] = G_GetLocalTime(item['create_time'], true)
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
            this.cerDatas = cer_datas
        }
    },
    created (){
        this.$emit('fMenuSeleted'); // 更新父组件的面包屑
        
        if(this.$route.params.hasOwnProperty('id_number')){
            this.id_number = this.$route.params['id_number']
            this.smsIdNumbers = [this.id_number]
            
            let url = req_user_info_detail + "&id_number=" + this.id_number
            this.$axios.get(url)    //请求的数据
            .then(result => {
                if(result && result.data && result.data.code == 200){
                    let user = result.data.user
                    user['birth'] = G_ComputeBirthDay(user['id_number'])
                    this.form = user
                    
                    this.parseApplyDatas(result)
                    this.parseCerDatas(result)
                    return
                }
                
                this.$Message.info('获取用户信息失败');
            }).catch(e => {
                this.$Message.info('获取用户信息失败');
            })
        }else{
            this.$Message.error("查无此用户");
            G_GoBack()
        }
    }
}
</script>

<style scoped>
    .MainItem{
        margin-top:20px;
    }
    .main_right{
        text-align:right;
        padding-right:20px;
    }
    .help-block{
         text-align:left;
    }
    .ivu-form-item-error-tip{
        padding-top: 2px;
    }
    .ivu-form-item{
        margin-bottom: 15px;
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
