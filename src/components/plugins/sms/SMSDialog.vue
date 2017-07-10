<template>
  <div>
      <Modal v-model="show" width="360">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>发送自定义短信</span>
          </p>
          <div style="text-align:center">
              <p style="text-align: left; font-size: 12px; color:#000;">短信模板ID:</p>
              <Input v-model="smsTemplateID" placeholder="模板ID"></Input>
              <br><br>
              <p style="text-align: left; font-size: 12px; color:#000;">参数1:</p>
              <Input v-model="smsParamsKey1" placeholder="Key"></Input>
              <Input v-model="smsParamsValue1" placeholder="Value"></Input>
              <br><br>
              <p style="text-align: left; font-size: 12px; color:#000;">参数2:</p>
              <Input v-model="smsParamsKey2" placeholder="Key"></Input>
              <Input v-model="smsParamsValue2" placeholder="Value"></Input>
          </div>
          <div slot="footer">
              <Button type="error" size="large" long  @click="onSMSDialogConfirm">发送</Button>
          </div>
      </Modal>
  </div>
</template>

<script>
export default {
    props: {
        value:{
            type: Boolean,
            default: false
        },
        id_numbers: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data(){
        return {
            smsTemplateID:'',
            smsParamsKey1:'',
            smsParamsValue1:'',
            smsParamsKey2:'',
            smsParamsValue2:'',
        }
    },
    methods:{
        onSMSDialogConfirm(){
            this.$emit("input",false)
            let params = {
                "templateId" : this.smsTemplateID,
                "id_numbers" : this.id_numbers
            }
            if(this.smsParamsKey1.length > 0){
                params['params'] = {}
                params['params'][this.smsParamsKey1] = this.smsParamsValue1
                if(this.smsParamsKey2.length > 0)
                    params['params'][this.smsParamsKey2] = this.smsParamsValue2
            }
            
            this.$axios.post(req_send_custom_sms, params).then(result => {
                if(result && result.data && result.data.code == 200){
                    this.$Message.success("短信发送成功")
                }else{
                    this.$Message.error("短信发送失败")
                }
            }).catch(e => {
                this.$Message.error("短信发送失败")
            })
        }
    },
    computed:{
        show:{
            get(){
                return this.value
            },
            set(val){
                this.$emit("input",val)
            }
        }
    },
    watch:{
         show:{
            handler(newValue, oldValue) {
                this.smsTemplateID = ""
                this.smsParamsKey1 = ""
                this.smsParamsValue1 = ""
                this.smsParamsKey2 = ""
                this.smsParamsValue2 = ""
            },
        }
    }
}
</script>

