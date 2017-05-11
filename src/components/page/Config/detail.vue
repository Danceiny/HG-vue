<template>
    <div id="detail">
        <Table height="200" :columns="columns" :data="data2"></Table>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                columns: [
                    {
                        title: '编号',
                        key: 'id'
                    },
                    {
                        title: 'File',
                        key: 'file'
                    },
                    {
                        title: 'Section',
                        key: 'section'
                    },
                    {
                        title: 'Key',
                        key: 'key'
                    },
                    {
                        title: 'Vulue',
                        key: 'value'
                    },
                    {
                        title: '备注',
                        key: 'notes'
                    },
                    {
                        title: '类型',
                        key: 'type'
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        render (row, column, index) {
                            return `<i-button type="primary" size="small" @click="modify(${index})">修改</i-button> <i-button type="primary" size="small" @click="show(${index})">查看</i-button> <i-button type="error" size="small" @click="remove(${index})">删除</i-button>`;
                        }
                    }
                ],
                data2: [
                    {
                        id: 1,
                        file: '王小明',
                        section: 18,
                        key: 'key',
                        value: 'value',
                        notes: '北京市朝阳区芍药居',
                        operation: 'modify',
                        type: 'string'
                    },
                    {
                        name: '张小刚',
                        age: 25,
                        address: '北京市海淀区西二旗'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道'
                    },
                    {
                        name: '王小明',
                        age: 18,
                        address: '北京市朝阳区芍药居'
                    },
                    {
                        name: '张小刚',
                        age: 25,
                        address: '北京市海淀区西二旗'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道'
                    }
                ]
            }
        },
        methods: {
            show (index) {
                this.$Modal.info({
                    title: 'info',
                    content: `id：${this.data2[index].id}<br>File：${this.data2[index].file}<br>type：${this.data2[index].type}`
                })
            },
            remove (index) {
                this.data2.splice(index, 1);
            },
            modify (index) {
//                this.$Modal.info({
//                    title: 'info',
//                    content: `id：${this.data2[index].id}<br>File：${this.data2[index].file}<br>type：${this.data2[index].type}`
//                });

                this.$localStorage.setItem('detail', `${this.data2[index]}`);
                this.$router.push('/config-modify');
            },
        },
        created: function () {
            //TODO: request detail by GET id from ip:port/getconfig?id=ID
            //TODO: process the response data, and rendor it to the detail table.
            //TODO: store it to window.localstorage


        }
    }
</script>


<!--带渲染、详情功能的可用模板-->
<!--<template>-->
<!--<Table border :context="self" :columns="columns7" :data="data6"></Table>-->
<!--</template>-->
<!--<script>-->
<!--export default {-->
<!--data () {-->
<!--return {-->
<!--self: this,-->
<!--columns7: [-->
<!--{-->
<!--title: '姓名',-->
<!--key: 'name',-->
<!--render (row, column, index) {-->
<!--return `<Icon type="person"></Icon> <strong>${row.name}</strong>`;-->
<!--}-->
<!--},-->
<!--{-->
<!--title: '年龄',-->
<!--key: 'age'-->
<!--},-->
<!--{-->
<!--title: '地址',-->
<!--key: 'address'-->
<!--},-->
<!--{-->
<!--title: '操作',-->
<!--key: 'action',-->
<!--width: 150,-->
<!--align: 'center',-->
<!--render (row, column, index) {-->
<!--return `<i-button type="primary" size="small" @click="show(${index})">查看</i-button> <i-button type="error" size="small" @click="remove(${index})">删除</i-button>`;-->
<!--}-->
<!--}-->
<!--],-->
<!--data6: [-->
<!--{-->
<!--name: '王小明',-->
<!--age: 18,-->
<!--address: '北京市朝阳区芍药居'-->
<!--},-->
<!--{-->
<!--name: '张小刚',-->
<!--age: 25,-->
<!--address: '北京市海淀区西二旗'-->
<!--},-->
<!--{-->
<!--name: '李小红',-->
<!--age: 30,-->
<!--address: '上海市浦东新区世纪大道'-->
<!--},-->
<!--{-->
<!--name: '周小伟',-->
<!--age: 26,-->
<!--address: '深圳市南山区深南大道'-->
<!--}-->
<!--]-->
<!--}-->
<!--},-->
<!--methods: {-->
<!--show (index) {-->
<!--this.$Modal.info({-->
<!--title: '用户信息',-->
<!--content: `姓名：${this.data6[index].name}<br>年龄：${this.data6[index].age}<br>地址：${this.data6[index].address}`-->
<!--})-->
<!--},-->
<!--remove (index) {-->
<!--this.data6.splice(index, 1);-->
<!--}-->
<!--}-->
<!--}-->
<!--</script>-->
