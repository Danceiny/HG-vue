<template>

    <div class="wrapper">
        <h1>
            后台管理系统
        </h1>
        <div class="login">
            <i-form ref="formInline" :model="formInline" :rules="ruleInline">
                <Form-item prop="user">
                    <Input v-model="formInline.user"></Input>
                </Form-item>
                <Form-item prop="password">
                    <Input v-model="formInline.password" type="password"></Input>
                </Form-item>
                <Form-item>
                    <i-button type="success" @click.native="handleSubmit('formInline')" long>登录</i-button>
                </Form-item>
            </i-form>
        </div>


        <div class="login">
            <i-form ref="formInline" :model="formInline" :rules="ruleInline">
                <Form-item prop="user">
                    <Input v-model="formInline.user"></Input>
                </Form-item>
                <Form-item prop="password">
                    <Input v-model="formInline.password" type="password"></Input>
                </Form-item>
                <Form-item>
                    <i-button type="success" @click.native="handleSubmit2('formInline')" long>登录</i-button>
                    <i-button type="primary" style="width:100%;" @click.native.prevent="handleReset2">重置</i-button>
                </Form-item>
            </i-form>
        </div>

        <div class="login">
            <i-form :model="ruleForm2" :rules="rules2" ref="ruleForm2">
                <h3 class="title">系统登录</h3>
                <Form-item prop="account">
                    <Input type="text" v-model="ruleForm2.account" auto-complete="on" placeholder="账号"></Input>
                </Form-item>
                <Form-item prop="checkPass">
                    <Input type="password" v-model="ruleForm2.checkPass" auto-complete="off"
                           placeholder="密码"></Input>
                </Form-item>
                <Checkbox v-model="checked" checked class="remember">记住密码</Checkbox>
                <!--<el-checkbox v-model="checked" checked class="remember"></el-checkbox>-->
                <Form-item style="width:100%;">
                    <i-button type="success" style="width:100%;" @click.native.prevent="handleSubmit2"
                              :loading="logining">登录
                    </i-button>
                    <i-button type="primary" style="width:100%;" @click.native.prevent="handleReset2">重置</i-button>
                </Form-item>
            </i-form>

        </div>

    </div>


</template>

<script>
    import {requestLogin} from '../../api/api';
    export default {
        data() {
            return {
                checked: true,
                formInline: {
                    user: '',
                    password: '',
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
                },
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogVisible: false,
                logining: false,
                ruleForm2: {
                    account: 'admin',
                    checkPass: '123456'
                },
                rules2: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        //{ validator: validaePass }
                    ],
                    checkPass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {
                            type: 'string',
                            min: 6,
                            message: '密码长度不能小于6位',
                            trigger: 'blur'
                        }
                        //{ validator: validaePass2 }
                    ]
                },
            }
        },
        methods: {

            //未验证版本
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {

                        this.$Message.success('提交成功!');
                        this.$router.push('/about');
                    } else {
                        this.instance('error');
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            handleReset(val) {
                console.log(val)
            },

            //验证
            handleReset2()
            {
                this.$refs.ruleForm2.resetFields();
            },
            handleSubmit2(ev)
            {
                var _this = this;
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        //_this.$router.replace('/table');
                        this.logining = true;
                        //NProgress.start();
                        var loginParams = {username: this.ruleForm2.account, password: this.ruleForm2.checkPass};
                        requestLogin(loginParams).then(data => {
                            this.logining = false;
                            //NProgress.done();
                            let {msg, code, user} = data;
                            if (code !== 200) {
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            } else {
                                sessionStorage.setItem('user', JSON.stringify(user));
                                this.$router.push({path: '/table'});
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // for dialog
            instance (type) {
                const title = '对话框的标题';
                const content = '<p>一些对话框内容</p><p>一些对话框内容</p>';
                switch (type) {
                    case 'info':
                        this.$Modal.info({
                            title: title,
                            content: content
                        });
                        break;
                    case 'success':
                        this.$Modal.success({
                            title: title,
                            content: content
                        });
                        break;
                    case 'warning':
                        this.$Modal.warning({
                            title: title,
                            content: content
                        });
                        break;
                    case 'error':
                        this.$Modal.error({
                            title: title,
                            content: content
                        });
                        break;
                }
            }
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

    .wrapper > h1 {
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

    .remember {
        margin: 0px 0px 35px 0px;
    }
</style>
