<template>
    <div>
        <i-form ref="form" :model="form" :rules="ruleValidate" id="form" :label-width="80" label-position="right">
            <Form-item label="ID：" prop="group_id" style="width: 20%;" >
                <Input size="large" v-model="form.group_id" :disabled="!canEdit||action==='modify'"></Input>
            </Form-item>
            <Form-item label="名称：" prop="group_name"style="width: 30%;" >
                <Input size="large" v-model="form.group_name" :disabled="!canEdit"></Input>
            </Form-item>
            <Form-item label="描述：" prop="des" style="width: 30%;" >
                <Input size="large" v-model="form.des" :disabled="!canEdit"></Input>
            </Form-item>
            <Form-item label="状态：" prop="status">
                <Radio-group v-model="form.status">
                    <Radio :label="0" :disabled="!canEdit">开放</Radio>
                    <Radio :label="1" :disabled="!canEdit">不开放</Radio>
                </Radio-group>
            </Form-item>
            <Form-item label="备注：" prop="remark" style="width: 30%;">
                <Input type="textarea" v-model="form.remark" :disabled="!canEdit" :rows="5"></Input>
            </Form-item>
            <Form-item v-show="action==='modify'" label="更新时间：" style="width: 60%;">
                {{form.update_time}}
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
            canEdit:G_CheckAdminPermission(19),
            ruleValidate:{
                group_id: [{required: true, type: 'string', message: '分组ID不能为空', trigger: 'blur'}],
                group_name: [{required: true, type: 'string', message: '分组名称不能为空', trigger: 'blur'}],
                des: [{required: true, type: 'string', message: '分组描述不能为空', trigger: 'blur'}],
            },
            action:'',
            form:{status:0}
        }
    },
    created () {
        this.$emit('fMenuSeleted'); // 更新父组件的面包屑
        
        if(this.$route.params.hasOwnProperty('group_id')){
            this.action = "modify"
            
            let url = req_examgroup_detail + "&group_id=" + this.$route.params['group_id']
            this.$axios.get(url)    //请求的数据
            .then(result => {
                if(result && result.data && result.data.code == 200){
                    let data = result.data.data
                    if(data.length > 0){
                        data = data[0]
                        data['update_time'] = G_GetLocalTime(data['update_time'], true)
                        this.form = data
                        return
                    }
                }
                
                this.$Message.info('获取分组信息失败');
            }).catch(e => {
                this.$Message.info('获取分组信息失败');
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
                    self.$axios.post(req_examgroup_modify, {action:"delete", group_id:self.form.group_id})
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
                    self.form.action = action
                    self.$Modal.confirm({
                        title: '确认？',
                        onOk: () => {
                            self.$axios.post(req_examgroup_modify, self.form)
                            .then(result =>{
                                if(result && result.data && result.data.code == 200){
                                    self.$Message.info('成功');
                                    if(action === 'add'){
                                        self.$router.replace("/ExamGroup/Detail/"+self.form['group_id'])
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
        }
    }
}
</script>

<style scoped>
</style>
