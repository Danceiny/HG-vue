<template>
    <!--<div v-bind:style="{ visibility: visibility }">-->
    <div>
        <div>
            <Button type="primary" size="large" @click="onClickedUpload" :disabled=" !is_can_edit">{{button_name}}
            </Button>
        </div>
        <div>
            <Modal
                    v-model="show_flag"
                    ok-text="插入"
            >
                <p slot="header" style="text-align:left">
                    <span>{{module_name}}</span>
                </p>
                <div>
                    <Row class="MainItem">
                        <!--<Col span="24" class="main_right">-->
                        <div style="width:100%; position:relative;overflow:hidden;height:40px;float:left">
                            <Input placeholder="请选择图片" v-model="img_names"
                                   style="position:absolute; left:0;width:75%;height:100%;"></Input>
                            <Button style="width:23%;height:80%; float:right;" type="primary" icon="checkmark-round">
                                选择图片
                            </Button>
                            <input type="file" :id="img_id" @change="onFileChange"
                                   style="opacity:0;position:absolute; left:0;width:100%;height:100%;"
                                   accept="image/jpeg,image/jpg,image/png" multiple="multiple"></input>
                        </div>

                    </Row>
                </div>
                <div slot="footer" style="text-align: center">
                    <Button type="ghost" @click="show_flag=false;"
                            style="margin-left: auto;margin-right: auto;">取消
                    </Button>
                    <Button type="primary" size="large" @click="onClickedUploadOk"
                            style="margin-left: auto;margin-right: auto;padding-left:20px;">{{onOkText}}
                    </Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    export default{
        name: 'upload-img-modal',
        props: {
            module_name: {
                default: '上传图片',
                type: String
            },
            button_name: {
                default: '上传图片',
                type: String
            },
            onOkText: {
                default: '上传',
                type: String
            },
            onUploadSuccess: {
                default: null,
                type: Function
            },
            renamePrefix:{
              default: '',
                type: String
            },
            visibility:{
                default: 'visible',
                type: String
            },
            img_id: {
                type: String,
                default: 'img_id'
            },
        },
        data(){
            return {
                modal_loading: false,
                multiple: true,
                is_can_edit: true,
                show_flag: false,
                img_names: ''
            }

        },
        mounted(){
        },
        methods: {
            renameFiles(files){
                let renamedFiles = [];
                for (let index = 0; index < files.length; index++) {
                    let file = files[index];
                    //修改文件名 防止冲突
                    let file_name = file.name;
                    let file_last_index = file_name.lastIndexOf('.')
                    let file_last = ".jpg"  // default
                    if (file_last_index != -1) {
                        file_last = file_name.substring(file_last_index, file_name.length)
                    }
//                    let file_name_oss = md5(file_name + Date.parse(new Date())) + file_last

                    //命名方案：
                    //[news_title + _ + file_name]
                    let file_name_oss = (this.renamePrefix + '_' + file_name.replace(file_last,'')) + file_last;

//                    file = {
//                        lastModified: 1496124026979,
//                        lastModifiedDate: 'Tue May 30 2017 14:00:26 GMT + 0800(China Standard Time)',
//                        name: "page_09.jpg",
//                        size: 4482902,
//                        type: "image/jpeg",
//                        webkitRelativePath: ""
//                    }
                    renamedFiles.push(file_name_oss);
                }
                return renamedFiles;
            },
            onClickedUpload(){
                this.show_flag = true
            },
            onFileChange(event)
            {
                let files = event.target.files, file;
                console.log('^^^^^^^^^^^^', files);
                this.img_names = files[0].name;
                for (let i = 1; i < files.length; i++) {
                    this.img_names += ',' + (files[i].name);
                }
//                if (files && files.length > 0) {
//                    let file = files[0];
//                    let file_name = file.name;
//                    // 判断图片大小
//                    if (file.size > 2 * 1024 * 1024) {
//                        this.$Modal.error({
//                            title: "温馨提示",
//                            content: '<span style="font-size:15px;float:left">图片大小不得超过2M！</span>'
//                        });
//                        return;
//                    }
//                    // 判断图片宽度
//                    var URL = window.URL || window.webkitURL;
//                    var imgURL = URL.createObjectURL(file);
//                    let image = new Image()
//                    image.src = imgURL
//                    setTimeout(function () {
//                        if (image.width > 500 || image.height > 900) {
//                            this.$Modal.error({
//                                title: "温馨提示",
//                                content: '<span style="font-size:15px;float:left">图片尺寸在500x900内！</span>'
//                            });
//                        } else {
//                        }
//                    }, 10)
//                }
            },
            check_is_can_upload_img(){
                let namesArr = this.img_names.split(',');//数组最后一个元素是''
                console.log('check_is_can_upload_img，文件原名',namesArr);
                for (let i = 0; i < namesArr.length - 1; i++) {
                    if (!/\.(jpg|jpeg|png)$/.test(namesArr[i].toLowerCase())) {
                        this.$Modal.error({
                            title: "温馨提示",
                            content: `<span style="font-size:15px;float:left">${namesArr[i]}文件名错误，仅支持jpg,jpeg,png格式图片！</span>`
                        });
                        return false;
                    }
                }
                return true;
            },
            onClickedUploadOk(){
                if (!this.check_is_can_upload_img())return;

                let files = document.getElementById(this.img_id).files;
                if (!files)return;
                let renamedFiles = this.renameFiles(files);
//                let region = 'oss-cn-hangzhou';
//                let accessKeyId = 'LTAILd5c2RRGOvd2';
//                let accessKeySecret = '81JmSiMQ37kt9fwubs1Tzok5JSCAJt';
//                let user_bucket = 'cecctm';
                let user_bucket_url = 'http://cecctm.oss-cn-hangzhou.aliyuncs.com/';
                let client = new OSS.Wrapper({
                    region: 'oss-cn-hangzhou',
                    accessKeyId: 'LTAILd5c2RRGOvd2',
                    accessKeySecret: '81JmSiMQ37kt9fwubs1Tzok5JSCAJt',
                    bucket: 'cecctm',
                });
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    let file_name_oss = 'news/' + renamedFiles[i];
                    client.multipartUpload(file_name_oss, file, {})
                        .then((results) => {
                                this.$Message.success("上传成功");
                                this.img_names = '';
                                console.log('回调函数',this.onUploadSuccess);
                                if (this.onUploadSuccess) {
                                    this.show_flag = false;
                                    this.onUploadSuccess(user_bucket_url + file_name_oss);
                                }
                            }
                        ).catch((err) => {
                        this.$Modal.error({
                            title: "温馨提示",
                            content: `<span style="font-size:15px;float:left">图片${file_name_oss}上传失败，请重新上传！</span>`
                        });
                    });
                }
            },
        },
    }
</script>

<style scoped>
</style>