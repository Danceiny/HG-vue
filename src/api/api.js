import axios from 'axios';

let base = 'http://127.0.0.1:8090';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getConfigById = params => { return axios.get(`${base}/config/`,params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


//
// import API from '../../api/API'
// const api = new API();
// export default{
// 	beforeMount(){
// 		this.loading2 = true;
// 		let that = this;
// 		let params = {
// 			api:"/getdbdata3",
// 			param:"exec xFool_p_getpubapp 'qjb',''"
// 		};
// 		api.get(params)
// 			.then(function(res){
// 				console.log(JSON.parse(res.data.data).sets[0].rows);
// 				that.tableData = JSON.parse(res.data.data).sets[0].rows;
// 				that.loading2 = false;
// 			})
// 			.catch(function(err){
// 				console.log(err);
// 				that.loading2 = false;
// 				api.reqFail(that,"获取列表失败请刷新");
// 			});
// 	},
// 	data() {
// 		return {
// 			tableData: [],
// 			DEFAULT_IMAGE:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
// 			isAdded:false,
// 			loading2:false,
// 			formAllApp:{
// 				keyword:""
// 			}
// 		}
// 	},
// 	methods:{
// 		handleAdd(index,row){
// 			console.log();
// 			this.tableData[index].isAdded = !this.tableData[index].isAdded;
// 		},
// 		onSubmit() {
//         	console.log('submit!');
//       	}
// 	}
// }



//
// import axios from 'axios'
// import config from './config'
//
// // axios(config);
// class API {
// 	//获取已授权列表
// 	get (param) {
// 		config.data.strSQL = param.param;
// 		return axios.post(param.api,{},config);
// 	}
// 	//添加授权
// 	post (param) {
// 		config.data.strSQL = param.param;
// 		return axios.post(param.api,{},config);
// 	}
// 	reqSuccess(obj,msg){
// 			obj.$message({
//           		message: msg,
//           		type: 'success'
//         	});
// 	}
// 	reqFail(obj,msg){
// 			obj.$message({
//           		message: msg,
//           		type: 'success'
//         	});
// 	}
// }
// export default API;