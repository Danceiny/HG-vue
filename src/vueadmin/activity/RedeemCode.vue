<template>
    <div>
        <Tabs type="card" :animated="false">
            <Tab-pane label="查询">
                <i-form ref="search_form" :model="search_form" id="search_form" :label-width="100" label-position="right">
                    <Form-item label="优惠码" required prop="code" style="width: 30%;">
                        <Input v-model="search_form.code"></Input>
                    </Form-item>
                    <Button type="primary" @click="onSearch" style="position: relative;left: 100px;">查询</Button>
                    <br><br>
                    <div v-show="search_result.code">
                        <Form-item label="优惠码">{{search_result.code}}</Form-item>
                        <Form-item label="明码">{{search_result.id}}</Form-item>
                        <Form-item label="减免价格(分)">{{search_result.discount_price}}</Form-item>
                        <Form-item label="渠道">{{search_result.source}}</Form-item>
                        <Form-item label="状态">{{search_result.status}}</Form-item>
                        <Form-item label="使用者">
                            <a target='_blank' :href="'#/User/Detail/'+search_result.id_number">{{search_result.id_number}}</a>
                        </Form-item>
                        <Form-item label="使用时间">{{search_result.used_time}}</Form-item>
                        <Form-item label="使用订单">{{search_result.pay_id}}</Form-item>
                    </div>
                </i-form>
            </Tab-pane>
            <Tab-pane label="生成" v-if="canMakeCode">
                <i-form ref="form" :model="form" id="form" :label-width="100" label-position="right">
                    <Form-item label="优惠码数量" required prop="count">
                        <Input-number :min="1" :max="1000" v-model="form.count" style="width: 20%;"></Input-number>
                        (一次最多1000)
                    </Form-item>
                    <Form-item label="减免价格(分)" required prop="discount_price">
                        <Input-number :min="1" v-model="form.discount_price" style="width: 20%;"></Input-number>
                    </Form-item>
                    <Form-item label="渠道" prop="source">
                        <Input size="large" v-model="form.source" style="width: 20%;"></Input>
                    </Form-item>
                    <Button type="primary" @click="onMake" style="position: relative;left: 100px;">生成</Button>
                    <br><br>
                    <Form-item label="生成编号" v-show="makeResult.code==200">
                        {{makeResult.begin_id}} - {{makeResult.end_id}}
                    </Form-item>
                </i-form>
            </Tab-pane>
            <Tab-pane label="下载" v-if="canDownloadCode">
                <i-form ref="download_form" :model="download_form" id="download_form" :label-width="100" label-position="right">
                    <Form-item label="开始编号" required style="width: 30%;">
                        <Input-number style="width: 100%;" :min="1000001" v-model="download_form.begin_id"></Input-number>
                    </Form-item>
                    <Form-item label="结束编号" required style="width: 30%;">
                        <Input-number style="width: 100%;" :min="1000001" v-model="download_form.end_id"></Input-number>
                    </Form-item>
                    <Form-item label="状态">
                        <Radio-group v-model="download_form.status">
                            <Radio label="-1">全部</Radio>
                            <Radio label="0">未使用</Radio>
                            <Radio label="1">已使用</Radio>
                        </Radio-group>
                    </Form-item>
                    <Form-item label="渠道" style="width: 30%;">
                        <Input size="large" v-model="download_form.source"></Input>
                    </Form-item>
                    <Button type="primary" @click="onDownload" style="position: relative;left: 100px;">下载</Button>
                </i-form>
            </Tab-pane>
        </Tabs>
    </div>
</template>

<script>
let _headers = [
    {title:"明码", key:'id', col:{wch:20}},
    {title:"优惠码", key:'code', col:{wch:20}},
    {title:"减免价格(分)", key:'discount_price', col:{wch:20}},
    {title:"状态", key:'status', col:{wch:20}},
    {title:"渠道", key:'source', col:{wch:20}},
    {title:"创建时间", key:'create_time', col:{wch:20}},
]

export default {
    data(){
        return {
            canMakeCode:G_CheckAdminPermission(27),
            canDownloadCode:G_CheckAdminPermission(28),
            search_form:{code:''},
            search_result:{},
            form:{count:1, discount_price:1, source:''},
            download_form:{begin_id:1000001, end_id:1000001, source:'', status:-1},
            makeResult:{}
        }
    },
    methods:{
        onMake(){
            let self = this
            if(self.form.count > 1000){
                self.$Message.error('一次最多生成1000个优惠码');
                return
            }
            
            self.$Modal.confirm({
                title: '确认生成优惠码？',
                onOk: () => {
                    self.$axios.post(req_redeemcode_make, self.form)
                    .then(result =>{
                        if(result && result.data && result.data.code == 200){
                            self.$Message.success('生成优惠码成功');
                            self.makeResult = result.data
                            self.download_form = {
                                begin_id:self.makeResult['begin_id'],
                                end_id:self.makeResult['end_id'],
                                status:self.download_form['status'],
                                source:self.form['source']
                            }
                        }else{
                            self.$Message.error('生成优惠码失败');
                        }
                    })
                },
                onCancel: () => {
                    self.$Message.info('您已取消添加生成优惠码');
                },
                content: `确认生成优惠码？`
            });
        },
        onDownload(){
            let self = this
            if(self.download_form.end_id - self.download_form.begin_id > 1000){
                self.$Message.error('一次最多只能导出1000个优惠码');
                return
            }
            let form = G_DeepCopy(self.download_form)
            if(form['status'] == -1)
                delete form['status']
            self.$axios.post(req_redeemcode_list, form)
            .then(result =>{
                if(result && result.data && result.data.code == 200){
                    let datas = result.data.datas
                    if(datas.length == 0){
                        self.$Message.error('没有对应的优惠码');
                        return
                    }
                    for(let i in datas){
                        let item = datas[i]
                        item['create_time'] = G_GetLocalTime(item['create_time'], true)
                        item['code'] = item['code'].replace(/\s/g, '').replace(/(.{4})/g, "$1 ").replace(/(^\s*)|(\s*$)/g, "") // 每隔4位插空格
                        switch(item['status']){
                        case 0:
                            item['status'] = '未使用'
                            break
                        case 1:
                            item['status'] = '已使用'
                            break
                        }
                    }
                    G_ExportDataToXLSX(_headers, datas)
                }else{
                    self.$Message.error('下载失败');
                }
            })
        },
        onSearch(){
            let self = this
            self.search_result = {}
            let code = self.search_form.code.replace(/\s/g, "")
            if(code.length < 8){
                self.$Message.error('优惠码格式有误');
                return
            }
            self.$axios.post(req_redeemcode_search, {code:code})
            .then(result =>{
                if(result && result.data && result.data.code == 200 && Object.getOwnPropertyNames(result.data.data).length > 0){
                    self.search_result = result.data.data
                    self.search_result['create_time'] = G_GetLocalTime(self.search_result['create_time'], true)
                    if(self.search_result['used_time']){
                        self.search_result = G_GetLocalTime(self.search_result['used_time'], true)
                    }
                    switch(self.search_result['status']){
                    case 0:
                        self.search_result['status'] = '未使用'
                        break
                    case 1:
                        self.search_result['status'] = '已使用'
                        break
                    }
                    return
                }
                
                self.$Message.error('查询失败');
            })
        }
    },
    created () {
        this.$emit('fMenuSeleted'); // 更新父组件的面包屑
    }
}
</script>

<style scoped>
    .ivu-form-item{
        margin-bottom: 15px;
    }
</style>
