<template>
    <div>
        <i-form ref="form" :model="form" :rules="ruleValidate" id="form" :label-width="100" label-position="right">
            <Form-item label="ID：" prop="product_id" style="width: 20%;" >
                <Input size="large" v-model="form.product_id" :disabled="!canEdit||action==='modify'"></Input>
            </Form-item>
            <Form-item label="名称：" prop="product_name"style="width: 40%;" >
                <Input size="large" v-model="form.product_name" :disabled="!canEdit"></Input>
            </Form-item>
            <Form-item label="描述：" prop="product_des" style="width: 40%;" >
                <Input size="large" v-model="form.product_des" :disabled="!canEdit"></Input>
            </Form-item>
            <Form-item label="价格(分)：" prop="price" style="width: 20%;" >
                <Input-number :min="0" v-model="form.price" :disabled="!canEdit"></Input-number>
            </Form-item>
            <Form-item label="标签：" prop="tag" style="width: 20%;" >
                <Input size="large" v-model="form.tag" :disabled="!canEdit"></Input>
            </Form-item>
            <Form-item label="状态：" prop="status">
                <Radio-group v-model="form.status">
                    <Radio :label="0" :disabled="!canEdit">开放</Radio>
                    <Radio :label="1" :disabled="!canEdit">不开放</Radio>
                </Radio-group>
            </Form-item>
            <Form-item label="从属分组：" prop="group_id">
                <Input size="large" v-model="form.group_id" :disabled="!canEdit" style="width: 20%;"></Input>
                <Select v-model="form.group_id" style="width:50%" v-show="canEdit">
                    <Option v-for="group in groupList" :value="group.value">{{ group.label }}</Option>
                </Select>
            </Form-item>
            <Form-item label="备注：" prop="remark" style="width: 40%;">
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
            canEdit:G_CheckAdminPermission(21),
            ruleValidate:{
                product_id:[{required: true, type: 'string', message: 'ID不能为空', trigger: 'blur'}],
                product_name:[{required: true, type: 'string', message: '名称不能为空', trigger: 'blur'}],
                group_id:[{required: true, type: 'string', message: '从属分组不能为空', trigger: 'blur'}],
            },
            groupList:[],
            form:{status:0, price:1, group_id:''}
        }
    },
    created () {
        this.$emit('fMenuSeleted'); // 更新父组件的面包屑
        
        if(this.$route.params.hasOwnProperty('product_id')){
            this.action = "modify"
            
            let url = req_examitem_detail + "&product_id=" + this.$route.params['product_id']
            this.$axios.get(url)    //请求的数据
            .then(result => {
                if(result && result.data && result.data.code == 200){
                    let data = result.data.data
                    if(data.length > 0){
                        data = data[0]
                        this.form = data
                        return
                    }
                }
                
                this.$Message.info('获取考试类目信息失败');
            }).catch(e => {
                this.$Message.info('获取考试类目信息失败');
                console.log(e)
            })
        }else{
            this.action = "add"
        }
        
        if(this.canEdit){
            this.$axios.get(req_examgroup_list)
            .then(result => {
                if(result && result.data && result.data.code == 200){
                    this.groupList.push({
                        value: '',
                        label: "清除"
                    })
                    for(let i in result.data.data){
                        let item = result.data.data[i]
                        this.groupList.push({
                            value: item['group_id'],
                            label: item['group_name']
                        })
                    }
                }
            })
        }
    },
    methods: {
        onModify(action){
            let self = this
            self.$refs['form'].validate((valid) => {
                if (valid) {
                    self.form.action = action
                    self.$Modal.confirm({
                        title: '确认？',
                        onOk: () => {
                            console.log(self.form)
                            self.$axios.post(req_examitem_modify, self.form)
                            .then(result =>{
                                if(result && result.data && result.data.code == 200){
                                    self.$Message.info('成功');
                                    if(action === 'add'){
                                        self.$router.replace("/ExamItem/Detail/"+self.form['product_id'])
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
        onDelete(){
            let self = this
            self.$Modal.confirm({
                title: '确认删除？',
                onOk: () => {
                    self.$axios.post(req_examitem_modify, {action:"delete", product_id:self.form.product_id})
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
        }
    }
}
</script>

<style scoped>
</style>
