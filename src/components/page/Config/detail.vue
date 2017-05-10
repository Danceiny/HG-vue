<template>
    <Table height="200" :columns="columns" :data="data2"></Table>
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
                        key: 'operation'
                    }
                ],
                data2: [
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
    }
</script>
