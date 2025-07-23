<template>
   <div class="wrapper">
       <h1>管理中心后台系统</h1>
       <div class="login">
           <i-form ref="formInline" :model="formInline" :rules="ruleInline">
               <Form-item prop="user">
                   <Input v-model="formInline.user" placeholder="账号"></Input>
               </Form-item>
               <Form-item prop="password">
                   <Input v-model="formInline.password" type="password" placeholder="密码"></Input>
               </Form-item>
               <Form-item prop="user">
                   <Checkbox v-model="formInline.keep">记住密码</Checkbox>
               </Form-item>
               <Form-item>
                   <i-button type="success" @click.native="handleSubmit('formInline')" long>登录</i-button>
               </Form-item>
           </i-form>
       </div>
   </div>
</template>

<script>
    import md5 from 'blueimp-md5'
    
    export default {
        data() {
            return {
                formInline: {
                    user: '',
                    password: '',
                    keep: false
                },
                ruleInline: {
                    user: [{
                        required: true,
                        message: '请填写用户名',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请填写密码',
                        trigger: 'blur'
                    }, {
                        type: 'string',
                        min: 6,
                        message: '密码长度不能小于6位',
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                let self = this
                self.$refs[name].validate((valid) => {
                    if (valid) {
                        let formData = {
                            username: self.formInline.user,
                            password: md5(self.formInline.password)
                        }
                        self.$axios.post(req_admin_login, formData)
                        .then(result => {
                            if(result && result.data && result.data.code == 200){
                                // 登录成功
                                G_SetStore("_admin_permission_", JSON.stringify(result.data.permission))
                                G_SetStore("_admin_realname_", result.data.realname)
                                if(self.formInline.keep){
                                    G_SetStore("_admin_username_", self.formInline.user)
                                    G_SetStore("_admin_password_", self.formInline.password)
                                }else{
                                    G_RemoveStore("_admin_username_")
                                    G_RemoveStore("_admin_password_")
                                }
                                // self.$router.push('/');
                                window.location.href = '/boss';
                            }else{
                                self.$Message.error("账号或密码有误！")
                            }
                        })
                        .catch(e => {
                            self.$Message.error("网络问题，请重试！")
                        })
                    }
                })
            }
        },
        created() {
            // 移除之前登录的数据
            G_ClearCookie()
            G_RemoveStore("_admin_permission_")
            
            this.formInline.user = G_GetStore("_admin_username_")
            this.formInline.password = G_GetStore("_admin_password_")
            this.formInline.keep = this.formInline.user ? true : false
        }
    }
</script>

<style scoped>
    .wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        padding-top: 150px;
        padding-bottom: 200px;
        /*background: -webkit-gradient(linear, 0 0, 0 bottom, from(#ff0000), to(rgba(0, 0, 255, 0.5)));*/
        /*background: #fff;*/
        /*url(http://78rbeb.com1.z0.glb.clouddn.com/wp-content/uploads/2014/03/free-blurred-web-backgrounds-04.jpg);*/
    }
    .wrapper > h1{
      text-align: center;
      vertical-align: middle;
      margin-bottom: 20px;
      color: #000;
    }
    .login {
        margin: 0 auto;
        padding: 200px auto;
        width: 200px;
        height: 100%;
    }
</style>
