<template>
   <div>
       <i-form ref="form" :model="form" :rules="ruleValidate" id="form" :label-width="80" label-position="right">
           <Form-item label="账号" prop="username" required style="width: 30%;">
               <Input size="large" v-model="form.username" :readonly="!canEdit||form.action==='modify'"></Input>
           </Form-item>
           <Form-item label="姓名" prop="realname" required style="width: 30%;">
               <Input size="large" v-model="form.realname" :readonly="!canEdit"></Input>
           </Form-item>
           <Form-item label="(重置)密码" prop="password" :required="form.action!=='modify'" style="width: 30%;">
               <Input size="large" v-model="form.password" :readonly="!canEdit"></Input>
           </Form-item>
           <Form-item label="备注" prop="remark" style="width: 60%;">
               <Input type="textarea" v-model="form.remark" :readonly="!canEdit"></Input>
           </Form-item>
           <Form-item label="权限">
               <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                   <Checkbox :disabled="!canEdit" v-model="permissionAll">超级管理员（包含现在及以后新增的所有权限）</Checkbox>
               </div>
               <div v-for="categorys,category in permissionMap">
                   <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                       <Checkbox
                           :indeterminate="categorys.indeterminate"
                           :value="categorys.checkAll"
                           @on-change="handleCheckAll(categorys)"
                           :disabled="!canEdit||permissionAll">{{category}}</Checkbox>
                   </div>
                   <Checkbox-group v-model="categorys.checkAllGroup" @on-change="checkAllGroupChange" @input="checkAllGroupChangeSetCategorys(categorys)">
                       <Checkbox v-for="item in categorys.items" :label="item.title" :disabled="!canEdit||permissionAll" :check_id="item.id"></Checkbox>
                   </Checkbox-group>
                   <br>
               </div>
           </Form-item>
       </i-form>
       <goback :confirm="canEdit" okMsg="您已放弃此次更改" cancelMsg="您已回到编辑状态"></goback>
       <Button v-show="canEdit&&form.action==='modify'" type="primary" @click="onDelete" style="position: relative;left: 100px;">删除</Button>
       <Button v-show="canEdit&&form.action==='modify'" type="warning" @click="onUpdate" style="position: relative;left: 100px;">保存修改</Button>
       <Button v-show="canEdit&&form.action!=='modify'" type="warning" @click="onAdd" style="position: relative;left: 100px;">新增</Button>
       <br><br>
   </div>
</template>

<script>
    import goback from '../../components/common/trick/goback.vue';
    import md5 from 'blueimp-md5'
    
    export default {
        components:{
            goback
        },
        data() {
            return {
                canEdit:G_CheckAdminPermission(13),
                permissionAll:false,
                ruleValidate: {
                    username: [
                        {required: true, message: '账号不能为空', trigger: 'blur'},
                        {min: 5, message: '账号不少于5个字符', trigger: 'blur'}
                    ],
                    realname: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'},
                        {min: 2, message: '姓名不少于2个字符', trigger: 'blur'}
                    ]
                },
                form:{},
                permissionMap:{}
            }
        },
        methods:{
            checkAllGroupChangeSetCategorys(categorys){
                this.changeCategorys = categorys
            },
            checkAllGroupChange(datas){
                this.changeCategorys.checkAllGroup = datas
                
                let itemsLength = this.changeCategorys.items.length
                let datasLength = datas.length
                if(itemsLength == datasLength){
                    this.changeCategorys.checkAll = true
                    this.changeCategorys.indeterminate = false
                }else if(datasLength>0){
                    this.changeCategorys.checkAll = false
                    this.changeCategorys.indeterminate = true
                }else{
                    this.changeCategorys.checkAll = false
                    this.changeCategorys.indeterminate = false
                }
                    
                this.changeCategorys = null
            },
            handleCheckAll(categorys){
                categorys.checkAll = !categorys.checkAll
                categorys.indeterminate = false
                categorys.checkAllGroup=[]
                if(categorys.checkAll){
                    for(let i in categorys.items){
                        categorys.checkAllGroup.push(categorys.items[i].title)
                    }
                }
            },
            getSelectedPermission(){
                let permission = []
                if(this.permissionAll) {
                    permission=['all']
                }else{
                    // 遍历选中的权限
                    for(let category in this.permissionMap){
                        let seletedItems = this.permissionMap[category].checkAllGroup
                        for(let i in seletedItems){
                            permission.push(parseInt(seletedItems[i].split('-')[0]))
                        }
                    }
                };
                this.form.permission = permission
                return JSON.stringify(permission)
            },
            onAdd(){
                let self = this
                self.$refs['form'].validate((valid) => {
                    if (valid) {
                        self.$Modal.confirm({
                            title: '确认添加？',
                            onOk: () => {
                                let formData = {
                                    action: "add",
                                    username: self.form.username,
                                    realname: self.form.realname,
                                    password: md5(self.form.password),
                                    remark: self.form.remark,
                                    permission: self.getSelectedPermission(),
                                }
                                self.$axios.post(req_bossuser_modify, formData)
                                .then(result =>{
                                    if(result && result.data && result.data.code == 200){
                                        self.$Message.info('添加管理员成功');
                                        // 跳转到详情页
                                        self.form.action = "modify"
                                        G_SetStore('bossUserDetail', JSON.stringify(self.form));
                                        self.$router.replace("/BossUser/detail/"+self.form.username)
                                        window.location.reload()
                                    }else{
                                        self.$Message.error('添加管理员失败');
                                    }
                                })
                            },
                            onCancel: () => {
                                self.$Message.info('您已取消添加');
                            },
                            content: `确认添加？`
                        });
                    }
                })
            },
            onUpdate(){
                let self = this
                self.$refs['form'].validate((valid) => {
                    if (valid) {
                        self.$Modal.confirm({
                            title: '确认修改？',
                            onOk: () => {
                                let formData = {
                                    action: "update",
                                    username: self.form.username,
                                    realname: self.form.realname,
                                    remark: self.form.remark,
                                    permission: self.getSelectedPermission(),
                                }
                                if(self.form.password && self.form.password.length>0){
                                    formData['password']=md5(self.form.password)
                                }
                                self.$axios.post(req_bossuser_modify, formData)
                                .then(result =>{
                                    if(result && result.data && result.data.code == 200){
                                        self.$Message.info('修改管理员成功');
                                        self.form.action = "modify"
                                        G_SetStore('bossUserDetail', JSON.stringify(self.form));
                                    }else{
                                        self.$Message.error('修改管理员失败');
                                    }
                                })
                            },
                            onCancel: () => {
                                self.$Message.info('您已取消修改');
                            },
                            content: `确认修改？`
                        });
                    }
                })
            },
            onDelete(){
                this.$Modal.confirm({
                    title: '确认删除？',
                    onOk: () => {
                        // 删除
                        this.$axios.post(req_bossuser_modify, {action:"delete",username:this.form.username})
                        .then(result =>{
                            if(result && result.data && result.data.code == 200){
                                this.$Message.info('删除管理员成功');
                                G_GoBack()
                            }
                        })
                    },
                    onCancel: () => {
                        this.$Message.info('您已取消删除');
                    },
                    content: `<strong>账号</strong>: ${this.form.username}<br>姓名: ${this.form.realname}`
                });
            },
            getPermissionList(){
                this.$axios.get(req_permission_list)
                .then(result => {
                    if(result && result.data && result.data.code == 200){
                        for(let i in result.data.data){
                            let item = result.data.data[i]
                            item['title'] = item['id']+"-"+item['title']
                            let category = item['category']
                            if(!this.permissionMap[category])
                                this.$set(this.permissionMap, category, {'items':[], 'checkAllGroup':[]})
                            if("modify"===this.form.action && G_CheckAdminPermission(item['id'], this.form.permission)){
                                this.permissionMap[category]['checkAllGroup'].push(item['title'])
                            }
                            this.permissionMap[category]['items'].push(item)
                        }
                        for(let category in this.permissionMap){
                            let checkAllGroupLength = this.permissionMap[category].checkAllGroup.length
                            let itemsLength = this.permissionMap[category].items.length
                            if(checkAllGroupLength == itemsLength){
                                this.permissionMap[category].checkAll = true
                            }else if(checkAllGroupLength>0){
                                this.permissionMap[category].indeterminate = true
                            }
                        }
                    }
                })
            }
        },
        created(){
            this.$emit('fMenuSeleted'); // 更新父组件的面包屑
            
            this.getPermissionList()
            let detail = G_GetStore('bossUserDetail')
            if(detail){
                this.form = JSON.parse(detail)
                this.permissionAll = G_CheckAdminPermission("all", this.form.permission)
            }else{
                // 新增情况下，要求输入密码
                this.ruleValidate.password = [
                    {required: true, message: '密码不能为空', trigger: 'blur'},
                    {min: 6, message: '密码不少于6个字符', trigger: 'blur'}
                ]
            }
        }
    }
</script>

<style scoped>
    #form {
        font-family: Lucida Console, Georgia;
        font-size: 100%;
        font-stretch: extra-expanded;
    }
</style>
