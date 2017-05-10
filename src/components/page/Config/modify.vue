<template>
    <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="编号">
            <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="File">
            <el-input v-model="form.file"></el-input>
            <!--<el-select v-model="form.file" placeholder="">-->
            <!--&lt;!&ndash;<el-option label="区域一" value="shanghai"></el-option>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-option label="区域二" value="beijing"></el-option>&ndash;&gt;-->
            <!--</el-select>-->
        </el-form-item>
        <el-form-item label="Section">
            <el-input v-model="form.section"></el-input>
            <!--<el-col :span="11">-->
            <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.date1"-->
            <!--style="width: 100%;"></el-date-picker>-->
            <!--</el-col>-->
            <!--<el-col class="line" :span="2">-</el-col>-->
            <!--<el-col :span="11">-->
            <!--<el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2"-->
            <!--style="width: 100%;"></el-time-picker>-->
            <!--</el-col>-->
        </el-form-item>
        <el-form-item label="Key">
            <el-input v-model="form.key"></el-input>
            <!--<el-switch on-text="" off-text="" v-model="form.delivery"></el-switch>-->
        </el-form-item>
        <el-form-item label="Value">
            <el-input v-model="form.value" type="json"></el-input>
            <!--<el-checkbox-group v-model="form.type">-->
            <!--<el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>-->
            <!--<el-checkbox label="地推活动" name="type"></el-checkbox>-->
            <!--<el-checkbox label="线下主题活动" name="type"></el-checkbox>-->
            <!--<el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>-->
            <!--</el-checkbox-group>-->
        </el-form-item>
        <el-form-item label="类型">
            <el-select v-model="form.type" placeholder="类型">
                <el-option label="xml" value="json"></el-option>
                <el-option label="json" value="xml"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="备注">
            <el-input type="textarea" v-model="form.notes"></el-input>
            <!--<el-radio-group v-model="form.resource">-->
            <!--<el-radio label="线上品牌商赞助"></el-radio>-->
            <!--<el-radio label="线下场地免费"></el-radio>-->
            <!--</el-radio-group>-->
        </el-form-item>
        <!--<el-form-item label="活动形式">-->
        <!--<el-input type="textarea" v-model="form.desc"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item>
            <el-button type="primary" @click="onSubmit">保存修改</el-button>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onDelete">删除</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
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
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            onDelete(){
                console.log('delete!');
            }
        }
    }
</script>