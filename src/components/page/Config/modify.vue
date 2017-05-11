<!--<template>-->
    <!--<el-form ref="form" :model="form" label-width="80px">-->
        <!--<el-form-item label="编号">-->
            <!--<el-input v-model="form.id"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="File">-->
            <!--<el-input v-model="form.file"></el-input>-->
            <!--&lt;!&ndash;<el-select v-model="form.file" placeholder="">&ndash;&gt;-->
            <!--&lt;!&ndash;&lt;!&ndash;<el-option label="区域一" value="shanghai"></el-option>&ndash;&gt;&ndash;&gt;-->
            <!--&lt;!&ndash;&lt;!&ndash;<el-option label="区域二" value="beijing"></el-option>&ndash;&gt;&ndash;&gt;-->
            <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
        <!--</el-form-item>-->
        <!--<el-form-item label="Section">-->
            <!--<el-input v-model="form.section"></el-input>-->
            <!--&lt;!&ndash;<el-col :span="11">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-date-picker type="date" placeholder="选择日期" v-model="form.date1"&ndash;&gt;-->
            <!--&lt;!&ndash;style="width: 100%;"></el-date-picker>&ndash;&gt;-->
            <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-col class="line" :span="2">-</el-col>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-col :span="11">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2"&ndash;&gt;-->
            <!--&lt;!&ndash;style="width: 100%;"></el-time-picker>&ndash;&gt;-->
            <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
        <!--</el-form-item>-->
        <!--<el-form-item label="Key">-->
            <!--<el-input v-model="form.key"></el-input>-->
            <!--&lt;!&ndash;<el-switch on-text="" off-text="" v-model="form.delivery"></el-switch>&ndash;&gt;-->
        <!--</el-form-item>-->
        <!--<el-form-item label="Value">-->
            <!--<el-input v-model="form.value" type="json"></el-input>-->
            <!--&lt;!&ndash;<el-checkbox-group v-model="form.type">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-checkbox label="地推活动" name="type"></el-checkbox>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-checkbox label="线下主题活动" name="type"></el-checkbox>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>&ndash;&gt;-->
            <!--&lt;!&ndash;</el-checkbox-group>&ndash;&gt;-->
        <!--</el-form-item>-->
        <!--<el-form-item label="类型">-->
            <!--<el-select v-model="form.type" placeholder="类型">-->
                <!--<el-option label="xml" value="json"></el-option>-->
                <!--<el-option label="json" value="xml"></el-option>-->
            <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="备注">-->
            <!--<el-input type="textarea" v-model="form.notes"></el-input>-->
            <!--&lt;!&ndash;<el-radio-group v-model="form.resource">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-radio label="线上品牌商赞助"></el-radio>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-radio label="线下场地免费"></el-radio>&ndash;&gt;-->
            <!--&lt;!&ndash;</el-radio-group>&ndash;&gt;-->
        <!--</el-form-item>-->
        <!--&lt;!&ndash;<el-form-item label="活动形式">&ndash;&gt;-->
        <!--&lt;!&ndash;<el-input type="textarea" v-model="form.desc"></el-input>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
        <!--<el-form-item>-->
            <!--<el-button type="primary" @click="onSubmit">保存修改</el-button>-->
        <!--</el-form-item>-->

        <!--<el-form-item>-->
            <!--<el-button type="primary" @click="onDelete">删除</el-button>-->
        <!--</el-form-item>-->
    <!--</el-form>-->
<!--</template>-->

<template>
    <Form ref="form" :model="form"  label-width="80px">
        <Form-item label="编号">
            <Input v-model="form.id"></Input>
        </Form-item>
        <Form-item label="File">
            <Input v-model="form.file"></Input>
        </Form-item>
        <Form-item label="Section">
            <Input v-model="form.section"></Input>
        </Form-item>
        <Form-item label="Key">
            <Input v-model="form.key"></Input>
        </Form-item>
        <Form-item label="Value">
            <Input v-model="form.value" type="json"></Input>
        </Form-item>
        <Form-item label="类型">
            <Select v-model="form.type" placeholder="类型">
                <Option label="xml" value="json">xml</Option>
                <Option label="json" value="xml">json</Option>
                <Option label="string" value="string">string</Option>
            </Select>
        </Form-item>
        <Form-item label="备注">
            <Input type="textarea" v-model="form.notes"></Input>
        </Form-item>

        <Form-item>
            <Button type="primary" @click="onSubmit">保存修改</Button>
        </Form-item>

        <Form-item>
            <Button type="primary" @click="onDelete">删除</Button>
        </Form-item>
    </Form>
</template>
<script>
    var d_jsonData = {};
    var d_strData = '';
    export default {
        data() {
            return {
                form: {
                    id: '',
                    file: '',
                    secion: '',
                    key: '',
                    value: '',
                    type: '',
                    notes: ''
                }//form数据由详情页组件传输过来。
//                form: d_jsonData
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
                //TODO: POST request to ip:port/config
            },
            onDelete(){
                console.log('delete!');
                //TODO: POST request to ip:port/config
            }
        },

        created: function () {
            //TODO: get detail from window.localstorage, and rendor the Form
            d_strData = this.$localStorage.get('detail');
            console.log(d_strData);
            d_jsonData = JSON.parse(d_strData);
            //const form = d_jsonData;
            console.log(d_jsonData);
            //渲染d_jsonData
        },
//        props:{
//            d_jsonData
//        }
    }
</script>