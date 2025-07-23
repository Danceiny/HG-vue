<template>
    <div>
        <i-form ref="form" :model="form" :rules="ruleValidate" id="form" :label-width="80" label-position="right">
            <Form-item label="编号" prop="id" style="width:20%;">
                <Input v-model="form.id" readonly>编号</Input>
            </Form-item>
            <Form-item label="File" prop="file" required style="width: 30%;">
                <Input size="large" v-model="form.file"></Input>
            </Form-item>
            <Form-item label="Section" prop="section" required style="width: 30%;">
                <Input size="large" v-model="form.section"></Input>
            </Form-item>
            <Form-item label="Key" prop="key" required style="width: 30%;">
                <Input size="large" v-model="form.key"></Input>
            </Form-item>
            <Form-item label="Value" prop="value" required>
                <Input type="textarea" :rows="5" id="value" v-model="form.value"></Input>
            </Form-item>
            <Form-item v-show="form.type==='json'">
                <Button type="primary" @click="formatJson()">格式化</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" @click="cancelFormatJson()">取消格式化</Button>
            </Form-item>
            <Form-item label="类型" prop="type" required>
                <Radio-group v-model="form.type">
                    <Radio label="string"></Radio>
                    <Radio label="json"></Radio>
                </Radio-group>
            </Form-item>
            <Form-item label="备注" prop="remark">
                <Input type="textarea" v-model="form.remark"></Input>
            </Form-item>
        </i-form>
        <goback confirm=true okMsg="您已放弃此次更改" cancelMsg="您已回到编辑状态"></goback>
        <Button v-show="form.action==='modify'" type="primary" @click="onDelete" style="position: relative;left: 100px;">删除</Button>
        <Button v-show="form.action==='modify'" type="warning" @click="onUpdate" style="position: relative;left: 100px;">保存修改</Button>
        <Button v-show="form.action!=='modify'" type="warning" @click="onAdd" style="position: relative;left: 100px;">新增</Button>
        <br><br>
    </div>
</template>
<script>
    import {
        isJSON
    } from '../../util/json.js';
    import goback from '../../components/common/trick/goback.vue';
    export default {
        data() {
            return {
                ruleValidate: {
                    file: [
                        {required: true, message: 'file不能为空', trigger: 'blur'},
                        {min: 2, message: 'file不少于2个字符', trigger: 'blur'}
                    ],
                    section: [
                        {required: true, message: 'section不能为空', trigger: 'blur'},
                        {min: 2, message: 'section不少于2个字符', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择数据类型', trigger: 'blur'}
                    ],
                    key: [
                        {required: true, message: 'key不能为空', trigger: 'blur'},
                        {min: 2, message: 'section不少于2个字符', trigger: 'blur'}
                    ],
                    value: [
                        {required: true, message: 'value不能为空', trigger: 'blur'}
                    ],
                    remark: [
                        {required: false, message:'备注', trigger: 'blur'},
                    ]
                },
                form: {
                    id: '',
                    file: '',
                    secion: '',
                    key: '',
                    value: '',
                    type: 'string',
                    remark: ''
                }//form数据由detail组件传输过来。
            }
        },
        methods: {
            checkJson(){
                if ('json' !== this.form.type) {
                    return true;
                }
                if (!isJSON(this.form.value)) {
                    this.$Message.error('The value is not JSON string!!!');
                    return false;
                }
                return true
            },
            formatJson(){
                if(this.checkJson()){
                    this.form.value = JSON.stringify(JSON.parse(this.form.value), null, "\t")
                }
            },
            cancelFormatJson(){
                if(this.checkJson()){
                    this.form.value = JSON.stringify(JSON.parse(this.form.value))
                }
            },
            onUpdate(){
                if (!this.checkJson())
                    return
                    
                let self = this
                self.$refs['form'].validate((valid) => {
                    if (valid) {
                        self.$Modal.confirm({
                            title: '确认修改？',
                            onOk: () => {
                                self.form.action = "update"
                                self.$axios.post(req_config_modify, self.form)
                                .then(result =>{
                                    if(result && result.data && result.data.code == 200){
                                        self.$Message.info('修改该配置项成功');
                                        G_SetStore('itemDetail', JSON.stringify(self.form))
                                    }else{
                                        self.$Message.error('修改配置失败');
                                    }
                                })
                            },
                            onCancel: () => {
                                self.$Message.info('您已取消修改');
                            },
                            content: '确认修改？'
                        });
                    }
                })
            },
            onAdd(){
                if (!this.checkJson())
                    return
                
                let self = this
                self.$refs['form'].validate((valid) => {
                    if (valid) {
                        self.$Modal.confirm({
                            title: '确认添加？',
                            onOk: () => {
                                self.form.action = "add"
                                self.$axios.post(req_config_modify, self.form)
                                .then(result =>{
                                    if(result && result.data && result.data.code == 200){
                                        self.$Message.info('添加该配置项成功');
                                        G_GoBack()
                                    }else{
                                        self.$Message.error('添加配置失败');
                                    }
                                })
                            },
                            onCancel: () => {
                                self.$Message.info('您已取消添加');
                            },
                            content: '确认添加？'
                        });
                    }
                })
            },
            onDelete(){
                this.$Modal.confirm({
                    title: '确认删除？',
                    onOk: () => {
                        // 删除
                        this.$axios.post(req_config_modify, {action:"delete",id:this.form.id})
                        .then(result =>{
                            if(result && result.data && result.data.code == 200){
                                this.$Message.info('删除该配置项成功');
                                G_GoBack()
                            }else{
                                this.$Message.error('删除配置失败');
                            }
                        })
                    },
                    onCancel: () => {
                        this.$Message.info('您已取消删除');
                    },
                    content: '删除配置项'
                });
            }
        },
        created: function () {
            this.$emit('fMenuSeleted'); // 更新父组件的面包屑
            if (this.$route.params.hasOwnProperty('itemId')) {
                // modify
                this.form = JSON.parse(G_GetStore('itemDetail'))
                this.form.action = "modify"
            } else {
                // add
                let form = JSON.parse(G_GetStore('fileandsection'))
                this.form.file = form.file ? form.file : ''
                this.form.section = form.section ? form.section : ''
            }
        },
        components:{
            goback
        }
    }
</script>

<style scoped>
    @charset "utf-8";
    /*CSS Document */
    #form {
        font-family: Lucida Console, Georgia;
        font-size: 100%;
        font-stretch: extra-expanded;
    }

    .div.ControlsRow, .HeadersRow {
        font-family: Georgia;
    }

    .Canvas {
        font-family: Lucida Console, Georgia;
        font-size: 13px;
        background-color: #ECECEC;
        color: #000000;
        border: solid 1px #CECECE;
    }

    .ObjectBrace {
        color: #00AA00;
        font-weight: bold;
    }

    .ArrayBrace {
        color: #0033FF;
        font-weight: bold;
    }

    .PropertyName {
        color: #CC0000;
        font-weight: bold;
    }

    .String {
        color: #007777;
    }

    .Number {
        color: #AA00AA;
    }

    .Boolean {
        color: #0000FF;
    }

    .Function {
        color: #AA6633;
        text-decoration: italic;
    }

    .Null {
        color: #0000FF;
    }

    .Comma {
        color: #000000;
        font-weight: bold;
    }

    PRE.CodeContainer {
        margin-top: 0px;
        margin-bottom: 0px;
    }

    PRE.CodeContainer img {
        cursor: pointer;
        border: none;
        margin-bottom: -1px;
    }

    #CollapsibleViewDetail a {
        padding-left: 10px;
    }

    #ControlsRow {
        white-space: nowrap;
        font: 11px Georgia;
    }

    #TabSizeHolder {
        padding-left: 10px;
        padding-right: 10px;
    }

    #HeaderTitle {
        text-align: right;
        font-size: 11px;
    }

    #HeaderSubTitle {
        margin-bottom: 2px;
        margin-top: 0px
    }

    #RawJson {
        width: 99%;
        height: 120px;
    }

    A.OtherToolsLink {
        color: #555;
        text-decoration: none;
    }

    A.OtherToolsLink:hover {
        text-decoration: underline;
    }
</style>