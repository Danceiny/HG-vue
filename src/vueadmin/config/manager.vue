<template>
    <div id="tree">
        <Dropdown style="margin-left: 20px">
            <Button type="primary">
                全局操作
                <Icon type="arrow-down-b"></Icon>
            </Button>
            <Dropdown-menu slot="list">
                <router-link v-show="canEdit" to="/config-manager/detail">
                    <Dropdown-item>新增配置</Dropdown-item>
                </router-link>
                <router-link to="/config-manager/list">
                    <Dropdown-item>查看全部</Dropdown-item>
                </router-link>
            </Dropdown-menu>
        </Dropdown>
            
        <Tree :data="configTree" ref="ConfigTree"></Tree>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                canEdit:G_CheckAdminPermission(11),
                configTree: []
            }
        },
        methods: {
            update_data_tree(){
                let self = this
                self.$axios.get(req_config_tree)
                .then(result => {
                    if(result && result.data && result.data.code == 200){
                        let configData = result.data.data
                        let configTree = [];
                        for (let i=0; i<configData.length; i++) {
                            let file = configData[i];
                            let fileNode = {
                                expand: true,
                                title: '<div><a style="color: #000000;font-size: 20px" href="#/config-manager/list/' + file.file + '"' + '><span style="color: #ff2707;font-size: 20px;">' + file.file + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;查看</a></div>',
                                children: []
                            };
                            for (let j=0; j<file.sections.length; j++) {
                                let section = file.sections[j];
                                fileNode.children.push({
                                    expand: true,
                                    title: '<div><a style="color: #000000;font-size: 15px" href="#/config-manager/list/' + file.file + '/' + section+ '"><span style="color: #000000;font-size: 15px">' + section + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;查看</a></div>'
                                })
                            }
                            configTree.push(fileNode);
                        }
                        self.configTree = configTree
                    }
                })
            }
        },
        created: function () {
            this.$emit('fMenuSeleted'); // 更新父组件的面包屑
            this.update_data_tree();
            G_RemoveStore("itemDetail")
            G_RemoveStore("fileandsection")
        }
    }
</script>
    
<style scoped>
    #tree {
        font-family: "Microsoft YaHei" ! important
    }
    #tree a:hover {
        font-style: italic;
    }
</style>


