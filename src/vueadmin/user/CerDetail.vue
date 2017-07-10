<template>
    <div>
        <div>
            <i-form ref="form" :model="cer" :rules="ruleValidate" id="form" :label-width="100" label-position="right">
                <Row style="position:absolute;  margin-left:250px;z-index:1;">
                    <Row>
                         <img style="height:120px;width:100px;" :src="user.head_img">
                    </Row>
                </Row>
                <Form-item label="身份证号:" style="width: 35%;">
                    <a target='_blank' :href="'#/User/Detail/'+user.id_number">{{user.id_number}}</a>
                </Form-item>
                <Form-item label="姓名:" style="width: 35%;">
                    {{user.name}}
                </Form-item>
                <Form-item label="手机号码:" style="width: 35%;">
                    {{user.phone_number}}
                </Form-item>
                <Form-item label="证书申请ID:" style="width: 35%;">
                    {{cer.cer_id}}
                </Form-item>
                <Form-item label="申请时间:" style="width: 35%;">
                    {{cer.create_time}}
                </Form-item>
                <Form-item label="缴费状态:">
                    {{cer.paid_info}}
                </Form-item>
                <Form-item label="证书状态:">
                    <span v-html="cer.cer_status"></span>
                </Form-item>
                <Form-item label="证书名称:" prop="cer_name" style="width: 40%;">
                    <Input size="large" v-model="cer.cer_name" :disabled="!canEdit"></Input>
                </Form-item>
                <Form-item label="证书编号:" prop="cer_no" style="width: 40%;">
                    <Input size="large" v-model="cer.cer_no" :disabled="!canEdit"></Input>
                </Form-item>
                <Form-item label="颁发机构:" prop="issue_name" style="width: 40%;">
                    <Input size="large" v-model="cer.issue_name" :disabled="!canEdit"></Input>
                </Form-item>
                <Form-item label="颁发日期:" prop="issue_date" style="width: 40%;">
                    <Input size="large" v-model="cer.issue_date" :disabled="!canEdit" placeholder="如：2017-07-01"></Input>
                </Form-item>
                <Form-item label="备注:" prop="remark" style="width: 40%;">
                    <Input type="textarea" v-model="cer.remark" :disabled="!canEdit" :rows="5"></Input>
                </Form-item>
                <Form-item label="邮寄信息:">
                    <span v-html="cer.mail_address"></span>
                </Form-item>
            </i-form>
        </div>
       <goback :confirm="canEdit" okMsg="您已放弃此次更改" cancelMsg=""></goback>
       <Button v-show="canEdit" type="primary" @click="onDelete" style="position: relative;left: 100px;">删除</Button>
       <Button v-show="canEdit" type="warning" @click="onModify" style="position: relative;left: 100px;">保存修改</Button>
    </div>
</template>

<script>
import goback from '../../components/common/trick/goback.vue';

export default {
    components:{
        goback
    },
    data(){
        return {
            canEdit:G_CheckAdminPermission(7),
            ruleValidate:{
                cer_name: [{required: true, type: 'string', message: '证书名称不能为空', trigger: 'blur'}],
                cer_no: [{required: true, type: 'string', message: '证书编号不能为空', trigger: 'blur'}],
                issue_name: [{required: true, type: 'string', message: '颁发机构不能为空', trigger: 'blur'}],
                issue_date: [{required: true, type: 'string', message: '颁发日期不能为空', trigger: 'blur'}]
            },
            cer:{},
            adderss:{},
            user:{}
        }
    },
    methods:{
        onModify(){
            let self = this
            self.$refs['form'].validate((valid) => {
                if (valid) {
                    let formData = {
                        action: "update",
                        cer_id: self.cer.cer_id,
                        cer_name: self.cer.cer_name,
                        cer_no: self.cer.cer_no,
                        issue_name: self.cer.issue_name,
                        issue_date: self.cer.issue_date,
                        remark: self.cer.remark
                    }
                    self.$Modal.confirm({
                        title: '确认？',
                        onOk: () => {
                            self.$axios.post(req_cer_info_modify, formData)
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
                        content: `确认？`
                    });
                }
            });
        },
        onDelete(){
            let self = this
            self.$Modal.confirm({
                title: '确认删除？',
                onOk: () => {
                    self.$axios.post(req_cer_info_modify, {action:"delete",cer_id:self.cer.cer_id})
                    .then(result =>{
                        if(result && result.data && result.data.code == 200){
                            self.$Message.info('删除成功');
                            self.$router.replace("/CerManager")
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
        }
    },
    created () {
        this.$emit('fMenuSeleted'); // 更新父组件的面包屑
        
        if(this.$route.params.hasOwnProperty('cer_id')){
            this.cer_id = this.$route.params['cer_id']
            
            let url = req_cer_info_detail + "&cer_id=" + this.cer_id
            this.$axios.get(url)    //请求的数据
            .then(result => {
                if(result && result.data && result.data.code == 200){
                    let cer = result.data.cer
                    if(cer.length > 0){
                        cer = cer[0]
                        this.cer = cer
                        cer['create_time'] = G_GetLocalTime(cer['create_time'], true)
                        if(cer['pay_id']){
                            cer['paid_info']  = '应缴'+(cer['amount']/100)+'元，'
                            switch(cer['paid_status']){
                            case -1:
                                cer['paid_info'] += "已删除"
                                break
                            case 0:
                                cer['paid_info'] += "待缴费"
                            case 1:
                                cer['paid_info'] += "实缴:" + (cer['amount']/100) + "元"
                                break
                            case 2:
                                cer['paid_info'] += "退款中:" + (cer['amount']/100) + "元"
                                break
                            case 3:
                                cer['paid_info'] += "退款成功:" + (cer['amount']/100) + "元"
                                break
                            case 4:
                                cer['paid_info'] += "退款失败:" + (cer['amount']/100) + "元"
                                break
                            case 5:
                                cer['paid_info'] += "已过期"
                                break
                            default:
                                cer['paid_info'] += "未知状态"
                                break
                            }
                            cer['paid_info'] += "，"
                            switch(cer['paid_channel']){
                            case 'wx_pub_qr':
                                cer['paid_info'] += "微信支付"
                                break
                            default:
                                cer['paid_info'] += "支付宝"
                                break
                            }
                            
                            switch(cer['cer_status']){
                            case -1:
                                cer['cer_status'] = "<span style='color:black'>未申请</span>"
                                break
                            case 0:
                                cer['cer_status'] = "<span style='color:green'>通过</span>"
                                break;
                            case 1:
                                cer['cer_status'] = "<span style='color:red'>不通过</span>"
                                break
                            case 2:
                                cer['cer_status'] = "<span style='color:#5B00AE'>申请中</span>"
                                break
                            }
                        }
                        
                        this.user = result.data.users[0]
                        if(result.data.address.length > 0){
                            let address = result.data.address[0]
                            cer['mail_address'] = address['address_province']+address['address_city']+address['address_area']+address['address_detail']+"<br>"+address['name']+"<br>"+address['phone_number']
                        }
                        return
                    }
                }
                
                this.$Message.info('获取证书信息失败');
            }).catch(e => {
                this.$Message.info('获取证书信息失败');
            })
        }else{
            this.$Message.error("查无此证书信息");
            G_GoBack()
        }
    }
}
</script>

<style scoped>
    .ivu-form-item-error-tip{
        padding-top: 2px;
    }
    .ivu-form-item{
        margin-bottom: 15px;
    }
</style>
