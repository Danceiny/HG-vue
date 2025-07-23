<template>
    <div>
        <i-form ref="form" :model="form" :rules="ruleValidate" id="form" :label-width="80" label-position="right">
            <Form-item v-show="action==='modify'" label="考试时间ID:" prop="time_id">
                <Input size="large" v-model="form.time_id" style="width: 30%;" disabled></Input>
                <Button type="ghost" @click="onViewStudents">查看本批次考生</Button>
                <Button type="ghost" v-show="canFinish" @click="onFinishExam">完成考试</Button>
            </Form-item>
            <Form-item label="截止时间:" prop="apply_limit_time">
                <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择截止时间" style="width: 30%" v-model="form.apply_limit_time" :disabled="!canEdit"></Date-picker>
            </Form-item>
            <Form-item label="开考时间:" prop="exam_time">
                <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择开考时间" style="width: 30%" v-model="form.exam_time" :disabled="!canEdit"></Date-picker>
            </Form-item>
            <Form-item label="时长(秒):" required prop="exam_length" style="width: 30%;">
                <Input-number :min="1" v-model="form.exam_length" :disabled="!canEdit"></Input-number>
            </Form-item>
            <Form-item>
                报名截止短信提醒：
                <Radio-group v-model="form.sms_apply_limit">
                    <Radio v-for="opt in smsOptionsList" :label="opt.value" :disabled="!canEdit">
                        {{opt.label}}
                    </Radio>
                </Radio-group>
                <br>
                考前24小时短信提醒：
                <Radio-group v-model="form.sms_exam_time" >
                    <Radio v-for="opt in smsOptionsList" :label="opt.value" :disabled="!canEdit">
                        {{opt.label}}
                    </Radio>
                </Radio-group>
            </Form-item>
            <Form-item label="备注" prop="remark" style="width: 60%;">
                <Input type="textarea" v-model="form.remark" :disabled="!canEdit" :rows="5"></Input>
            </Form-item>
        </i-form>
        <goback :confirm="canEdit" okMsg="您已放弃此次更改" cancelMsg="您已回到编辑状态"></goback>
        <Button v-show="canEdit&&action==='modify'" type="primary" @click="onDelete" style="position: relative;left: 100px;">删除</Button>
        <Button v-show="canEdit&&action==='modify'" type="warning" @click="onModify('update')" style="position: relative;left: 100px;">保存修改</Button>
        <Button v-show="canEdit&&action!=='modify'" type="warning" @click="onModify('add')" style="position: relative;left: 100px;">新增</Button>
    </div>
</template>

<script>
import goback from '../../components/common/trick/goback.vue';
    
export default {
    components:{
        goback
    },
    data () {
        return {
            canEdit:G_CheckAdminPermission(15),
            canFinish:G_CheckAdminPermission(25),
            smsOptionsList:[
                {
                    "value" : 0,
                    "label" : '不发',
                },
                {
                    "value" : 1,
                    "label" : '要发',
                },
                {
                    "value" : 2,
                    "label" : '已发',
                }
            ],
            action:'',
            form:{exam_length:7200, sms_apply_limit:1, sms_exam_time:1},
            ruleValidate:{
                apply_limit_time: [
                    {required: true, type: 'date', message: '截止时间不能为空', trigger: 'blur'},
                ],
                exam_time: [
                    {required: true, type: 'date', message: '开考时间为空', trigger: 'blur'},
                ]
            },
        }
    },
    created () {
        this.$emit('fMenuSeleted'); // 更新父组件的面包屑
        if(this.$route.params.hasOwnProperty('itemId')){
            this.action = "modify"
            
            let url = req_examtime_info + "&time_id=" + this.$route.params['itemId']
            this.$axios.get(url)    //请求的数据
            .then(result => {
                if(result && result.data && result.data.code == 200){
                    let data = result.data.data
                    if(data.length > 0){
                        data = data[0]
                        this.exam_time = data['exam_time']
                        data['exam_time'] = G_TimeStampToDatetime(data['exam_time'])
                        data['apply_limit_time'] = G_TimeStampToDatetime(data['apply_limit_time'])
                        this.form = data
                        return
                    }
                }
                
                this.$Message.info('获取考试时间信息失败');
            }).catch(e => {
                this.$Message.info('获取考试时间信息失败');
                console.log(e)
            })
        }
    },
    methods: {
        onDelete(){
            let self = this
            self.$Modal.confirm({
                title: '确认删除？',
                onOk: () => {
                    self.$axios.post(req_examtime_modify, {action:"delete",time_id:self.form.time_id})
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
        onModify(action){
            let self = this
            self.$refs['form'].validate((valid) => {
                if (valid) {
                    let formData = {
                        action: action,
                        apply_limit_time: G_DatetimeToTimeStamp(self.form.apply_limit_time),
                        exam_time: G_DatetimeToTimeStamp(self.form.exam_time),
                        exam_length: self.form.exam_length,
                        remark: self.form.remark,
                        sms_apply_limit : self.form.sms_apply_limit,
                        sms_exam_time: self.form.sms_exam_time,
                        remark: self.form.remark ? self.form.remark : ''
                    }
                    if(formData['apply_limit_time'] >= formData['exam_time']){
                        self.$Message.error('截止时间不得晚于开考时间');
                        return
                    }
                    
                    formData['time_id'] = self.form.time_id ? self.form.time_id : formData['exam_time']

                    self.$Modal.confirm({
                        title: '确认？',
                        onOk: () => {
                            self.$axios.post(req_examtime_modify, formData)
                            .then(result =>{
                                if(result && result.data && result.data.code == 200){
                                    self.$Message.info('成功');
                                    if(action === 'add'){
                                        self.$router.replace("/ExamTime/detail/"+formData['time_id'])
                                        window.location.reload()
                                    }
                                }else{
                                    self.$Message.error('失败');
                                }
                            })
                        },
                        onCancel: () => {
                            self.$Message.info('您已取消');
                        },
                        content: `确认？`
                    });
                }
            });
        },
        onViewStudents(){
            G_SetStore("_tmp_apply_exam_time_id_", this.form.time_id)
            G_SetStore("_tmp_apply_status_", 1)
            window.open('#/ReviewList', '_blank')
        },
        onFinishExam(){
            let self = this
            if(self.exam_time > Date.parse(new Date())/1000){
                self.$Message.error('考试还未开始！！！');
            }
            
            self.$Modal.confirm({
                title: '确认完成考试？',
                onOk: () => {
                    self.$axios.post(req_examtime_finish, {time_id:self.form.time_id})
                    .then(result =>{
                        if(result && result.data && result.data.code == 200){
                            self.$Message.info('完成考试成功');
                        }else{
                            self.$Message.error('完成考试失败');
                        }
                    })
                },
                onCancel: () => {
                    self.$Message.info('您已取消完成考试');
                },
                content: `确认完成考试？`
            });
        }
    }
}
</script>

<style scoped>
</style>
