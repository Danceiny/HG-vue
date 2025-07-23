<template>
    <div>
        <Button v-show="canEdit" @click="onAdd">新增类目</Button>
        <Tree :data="configTree"></Tree>
    </div>
</template>

<script>
export default {
    data () {
        return {
            canEdit:G_CheckAdminPermission(21),
            configTree:[],
        }
    },
    created () {
        this.$emit('fMenuSeleted'); // 更新父组件的面包屑
        
        let url = req_examitem_list
        
        this.$axios.get(req_examgroup_list)
        .then(result => {
            if(result && result.data && result.data.code == 200){
                let groupMap = {}
                for(let i in result.data.data){
                    let item = result.data.data[i]
                    groupMap[item['group_id']] = item['group_name']
                }
                
                this.$axios.get(url)    //请求的数据
                .then(result => {
                    if(result && result.data && result.data.code == 200){
                        let datas = result.data.data
                        let configTreeMap = {}
                        let itemsMap = {}
                        for(let i in datas){
                            let data = datas[i]
                            let item = {
                                expand:false,
                                children:[],
                                title:'<div><a target="_blank" style="color: #000000;font-size: 15px" href="#/ExamItem/Detail/' + data['product_id'] + '"' + '><span style="color: #000000;font-size: 15px;">' + data.product_name + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;查看</a></div>'
                            }
                    
                            let group_id = data['group_id']
                            let product_id = data['product_id']
                            if(!configTreeMap[group_id]){
                                configTreeMap[group_id] = []
                            }
                            configTreeMap[group_id].push(item)
                            itemsMap[product_id] = item
                        }
                        let delete_keys = []
                        for(let key in configTreeMap){
                            if(itemsMap[key]){
                                itemsMap[key]['children'] = itemsMap[key]['children'].concat(configTreeMap[key])
                                delete_keys.push(key)
                            }else{
                                this.configTree.push({
                                    expand:false,
                                    title:'<div><span style="color: #ff2707;font-size: 20px;">' + groupMap[key] + '</span></div>',
                                    children:configTreeMap[key],
                                })
                            }
                        }
                    }
                })
            }
        })
    },
    methods: {
        onAdd(){
            window.open('#/ExamItem/Detail', '_blank')
        }
    }
}
</script>

<style scoped>
</style>
