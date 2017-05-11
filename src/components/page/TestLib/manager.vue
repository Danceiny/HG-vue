<template>
    <div>
        <Form ref="form" :model="form" label-width="80px">
            <!--<Form-item label="编号">-->
            <!--<Input v-model="form.id"></Input>-->
            <!--</Form-item>-->
            <!--<Form-item label="File">-->
            <!--<Input v-model="form.file"></Input>-->
            <!--</Form-item>-->
            <!--<Form-item label="Section">-->
            <!--<Input v-model="form.section"></Input>-->
            <!--</Form-item>-->
            <!--<Form-item label="Key">-->
            <!--<Input v-model="form.key"></Input>-->
            <!--</Form-item>-->
            <!--<Form-item label="Value">-->
            <!--<Input v-model="form.value" type="json"></Input>-->
            <!--</Form-item>-->
            <Form-item label="类型">
                <Select v-model="form.type" placeholder="类型">
                    <Option label="xml" value="json">xml</Option>
                    <Option label="json" value="xml">json</Option>
                    <Option label="string" value="string">string</Option>
                </Select>
            </Form-item>
            <Form-item label="格式化文本">
                <Input type="textarea" v-model="form.notes"></Input>
            </Form-item>

            <Form-item>
                <Button type="primary" @click="onSubmit">添加</Button>
            </Form-item>

            <!--<Form-item>-->
            <!--<Button type="primary" @click="onDelete">删除</Button>-->
            <!--</Form-item>-->
        </Form>

        <div style="margin: 10px">
            显示边框
            <i-switch v-model="showBorder" style="margin-right: 5px"></i-switch>
            显示斑马纹
            <i-switch v-model="showStripe" style="margin-right: 5px"></i-switch>
            显示索引
            <i-switch v-model="showIndex" style="margin-right: 5px"></i-switch>
            显示多选框
            <i-switch v-model="showCheckbox" style="margin-right: 5px"></i-switch>
            显示表头
            <i-switch v-model="showHeader" style="margin-right: 5px"></i-switch>
            表格滚动
            <i-switch v-model="fixedHeader" style="margin-right: 5px"></i-switch>
            <br>
            <br>
            表格尺寸
            <Radio-group v-model="tableSize" type="button">
                <Radio label="large">大</Radio>
                <Radio label="default">中</Radio>
                <Radio label="small">小</Radio>
            </Radio-group>
        </div>

        <Table :border="showBorder" :stripe="showStripe" :show-header="showHeader" :height="fixedHeader ? 250 : ''"
               :size="tableSize" :data="tableData3" :columns="tableColumns3"></Table>
    </div>
</template>
<script>
    var d_jsonData = {};
    var d_strData = '';
    export default {
        data () {
            return {
                form: {
                    id: '',
                    file: '',
                    secion: '',
                    key: '',
                    value: '',
                    type: '',
                    notes: ''
                },
                tableData3: [
                    {
                        name: '王小明',
                        age: 18,
                        address: '北京市朝阳区芍药居',
                        date: '2016-10-03'
                    },
                    {
                        name: '张小刚',
                        age: 24,
                        address: '北京市海淀区西二旗',
                        date: '2016-10-01'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        address: '上海市浦东新区世纪大道',
                        date: '2016-10-02'
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道',
                        date: '2016-10-04'
                    },
                    {
                        name: '王小明',
                        age: 18,
                        address: '北京市朝阳区芍药居',
                        date: '2016-10-03'
                    },
                    {
                        name: '张小刚',
                        age: 24,
                        address: '北京市海淀区西二旗',
                        date: '2016-10-01'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        address: '上海市浦东新区世纪大道',
                        date: '2016-10-02'
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道',
                        date: '2016-10-04'
                    }
                ],
                showBorder: false,
                showStripe: false,
                showHeader: true,
                showIndex: true,
                showCheckbox: false,
                fixedHeader: false,
                tableSize: 'default'
            }
        },
        methods: {
            onSubmitAdd()
            {
                console.log('submitadd!');
                //TODO: POST request to ip:port/config
            }
            ,
            onDelete()
            {
                console.log('delete!');
                //TODO: POST request to ip:port/config
            }
        }
        ,

        created: function () {
//            //TODO: get detail from window.localstorage, and rendor the Form
//            d_strData = this.$localStorage.get('detail');
//            console.log(d_strData);
//            d_jsonData = JSON.parse(d_strData);
//            //const form = d_jsonData;
//            console.log(d_jsonData);
//            //渲染d_jsonData
        }
        ,
        //        props:{
        //            d_jsonData
        //        }
        computed: {
            tableColumns3()
            {
                let columns = [];
                if (this.showCheckbox) {
                    columns.push({
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    })
                }
                if (this.showIndex) {
                    columns.push({
                        type: 'index',
                        width: 60,
                        align: 'center'
                    })
                }
                columns.push({
                    title: '日期',
                    key: 'date',
                    sortable: true
                });
                columns.push({
                    title: '姓名',
                    key: 'name'
                });
                columns.push({
                    title: '年龄',
                    key: 'age',
                    sortable: true,
                    filters: [
                        {
                            label: '大于25岁',
                            value: 1
                        },
                        {
                            label: '小于25岁',
                            value: 2
                        }
                    ],
                    filterMultiple: false,
                    filterMethod (value, row) {
                        if (value === 1) {
                            return row.age > 25;
                        } else if (value === 2) {
                            return row.age < 25;
                        }
                    }
                });
                columns.push({
                    title: '地址',
                    key: 'address',
                    filters: [
                        {
                            label: '北京',
                            value: '北京'
                        },
                        {
                            label: '上海',
                            value: '上海'
                        },
                        {
                            label: '深圳',
                            value: '深圳'
                        }
                    ],
                    filterMethod (value, row) {
                        return row.address.indexOf(value) > -1;
                    }
                });
                return columns;
            }
        }
    }
</script>