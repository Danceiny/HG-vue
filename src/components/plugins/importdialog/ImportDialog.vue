<template>
  <div>
      <Modal v-model="show" width="1200" @on-ok="onOK">
          <Table border :columns="columns" size="small" :data="data" height="300"></Table>
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
        columns: {
            type: Array
        },
        data: {
            type: Array,
            default: []
        },
        onOK: {
            type: Function
        }
    },
    data(){
        return {
        }
    },
    methods:{
        onConfirm(){
            this.$emit("input",false)
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
                
            },
        }
    }
}
</script>

