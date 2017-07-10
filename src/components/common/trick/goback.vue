<template>
    <Button type="info" @click="onReturn" style="float: left">返回</Button>
</template>

<script>
    export default {
        name: 'goback-btn',
        data () {
            return {
                msg: ''
            }
        },
        props: [
            'okMsg',
            'cancelMsg',
            'confirm'
        ],
        methods: {
            onReturn(){
                if (this.confirm===true || this.confirm==="true") {
                    this.$Modal.confirm({
                        title: '放弃更改？',
                        onOk: () => {
                            G_GoBack()
                            if(this.okMsg.length>0)
                                this.$Message.info(this.okMsg);
                        },
                        onCancel: () => {
                            if(this.cancelMsg.length>0)
                                this.$Message.info(this.cancelMsg);
                        },
                        content: '返回上一级'
                    });
                }else {
                    G_GoBack()
                }
            }
        }
    }
</script>