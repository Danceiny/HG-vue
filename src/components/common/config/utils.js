/**
 * Created by dmy on 2017/5/17.
 */

//检查是否登录过
global.G_CheckIsLogined = ()=> {
    var token = G_GetCookie('_admin_token_')
    return token != null && token != ''
}

//* localStorage相关操作 //*/
global.G_SetStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

global.G_GetStore = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
}

global.G_RemoveStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}

//* Cookie相关操作 //*/
global.G_GetCookie = (key) => {
    var search = key + "="//查询检索的值
    var returnvalue = null;//返回值
    if (document.cookie.length > 0) {
        var sd = document.cookie.indexOf(search);
        var end
        if (sd != -1) {
            sd += search.length;
            end = document.cookie.indexOf(";", sd);
            if (end == -1)
                end = document.cookie.length;
            //unescape() 函数可对通过 escape() 编码的字符串进行解码。
            returnvalue = unescape(document.cookie.substring(sd, end))
        }
    } 
    return returnvalue;
}

global.G_SetCookie = (key, value, time) => {
    if(time){
        var exp = new Date();
        exp.setTime(exp.getTime() + time*1000);
        document.cookie = key + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }else{
        document.cookie = key + "="+ escape (value);
    }
}

global.G_ClearCookie = () =>{
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i=keys.length; i--;)
            document.cookie=keys[i]+'=0;expires=' + new Date(0).toUTCString()
    }
}

global.G_RemoveCookie = (key) => {
    if(G_GetCookie(key) != null)
        document.cookie=key+"=0;expires=" + new Date(0).toUTCString();
}

global.G_CheckAdminPermission = (value, openPermission) => {
    let permission
    if(openPermission){
        permission = openPermission
    }else{
        permission = G_GetStore("_admin_permission_")
        if(permission && permission.length>0){
            permission = JSON.parse(permission)
        }else{
            permission = []
        }
    }
    if(permission.indexOf('all') >= 0 || permission.indexOf(value) >= 0){
        return true
    }
    return false
}

global.G_TypeOf = (obj) => {
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]'  : 'boolean',
        '[object Number]'   : 'number',
        '[object String]'   : 'string',
        '[object Function]' : 'function',
        '[object Array]'    : 'array',
        '[object Date]'     : 'date',
        '[object RegExp]'   : 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]'     : 'null',
        '[object Object]'   : 'object'
    };
    return map[toString.call(obj)];
}

global.G_DeepCopy = (data) => {
    const t = G_TypeOf(data);
    let o;

    if (t === 'array') {
        o = [];
    } else if ( t === 'object') {
        o = {};
    } else {
        return data;
    }

    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(G_DeepCopy(data[i]));
        }
    } else if ( t === 'object') {
        for (let i in data) {
            o[i] = G_DeepCopy(data[i]);
        }
    }
    return o;
}

global.G_MergeMap = (map1, map2, overwrite) => {
    for(let key in map2){
        if(undefined == map1[key] || overwrite)
            map1[key] = map2[key]
    }
}

global.G_FixNumber = (num, length) => {
	return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}

global.G_DatetimeToTimeStamp = (date, msec) => {
    if(!date) return ''
    return Date.parse(date) / (msec ? 1 : 1000)
}

global.G_TimeStampToDatetime = (timestamp, msec) => {
    return new Date(parseInt(timestamp) * (msec ? 1 : 1000))
}

global.G_ComputeBirthDay = (id_number) => {
    if (id_number.length > 15){
        return id_number.substring(6, 10) + "-" + id_number.substring(10, 12) + "-" + id_number.substring(12, 14)
    }
    return '未知'
}

global.G_GetLocalTime = (time, need_sec) => {
    var date = new Date(parseInt(time) * 1000);
    var Y = date.getFullYear() + '-';
    var M = date.getMonth()+1 + '-';
    var D = date.getDate() + ' ';
    var h = G_FixNumber(date.getHours(), 2) + ':';
    var m = G_FixNumber(date.getMinutes(), 2);
    var s = '';
    if(need_sec){
      s = ':' + G_FixNumber(date.getSeconds(), 2)
    }
    return Y+M+D+h+m+s;
}

// 导出excel,参考https://segmentfault.com/a/1190000004395728
import XLSX from 'xlsx';
import FileSaver from 'file-saver';
import Blob from 'blob';
global.G_ExportDataToXLSX = (_headers, _data) => {
    let headers = _headers.map((v, i) => Object.assign({}, {v: (v['title']==undefined||v['title']==null)?v['key']:v['title'], position: String.fromCharCode(65+i) + 1 })).reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
    let data = _data.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: (v[k['key']]==undefined||v[k['key']]==null)?'':''+v[k['key']], position: String.fromCharCode(65+j) + (i+2) }))).reduce((prev, next) => prev.concat(next)).reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
    let cols =_headers.map((v, i) => Object.assign({}, v['col']==undefined||v['col']==null?{}:v['col']))
    // 合并 headers 和 data
    let output = Object.assign({}, headers, data);
    // 获取所有单元格的位置
    let outputPos = Object.keys(output);
    // 计算出范围
    let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
    // 构建 workbook 对象
    let wb = {
        SheetNames: ['Sheet1'],
        Sheets: {
            'Sheet1': Object.assign({}, output, { '!ref': ref, '!cols':cols })
        }
    };
    // 导出 Excel
    let wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
    FileSaver.saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), Date.parse(new Date())+".xlsx")
}

// excel插入图片参考：https://jsfiddle.net/1g24vowu/1/
function imgToDataUrl(img){
    let canvar = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    canvas.getContext('2d').drawImage(img, 0, 0)
    return canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '')
}

function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

global.G_ImportDataFromXLSX = (file, keys, callback) =>{
    let fileReader = new FileReader()
    fileReader.onload = function(ev) {
        try {
            let data = ev.target.result
            let workbook = XLSX.read(data, {
                type: 'binary'
            }) // 以二进制流方式读取得到整份excel表格对象
            let sheetName = workbook.SheetNames[0]
            let sheet = workbook.Sheets[sheetName]
            let datas = XLSX.utils.sheet_to_json(sheet)
            for(let i in datas){
                let data = datas[i]
                for(let key in data){
                    if(keys[key]){
                        data[keys[key]] = data[key]
                        delete data[key]
                    }
                }
            }
            if(callback) callback(datas);
        } catch (e) {
            alert('文件类型不正确');
            return;
        }
    }
    fileReader.readAsBinaryString(file)
}

global.G_GoBack = () => {
    if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ // IE  
        if(history.length > 0){  
            window.history.go( -1 );  
        }else{  
            window.opener=null;window.close();  
        }  
    }else{ //非IE浏览器  
        if (navigator.userAgent.indexOf('Firefox') >= 0 ||  
            navigator.userAgent.indexOf('Opera') >= 0 ||  
            navigator.userAgent.indexOf('Safari') >= 0 ||  
            navigator.userAgent.indexOf('Chrome') >= 0 ||  
            navigator.userAgent.indexOf('WebKit') >= 0){  
                if(window.history.length > 1){  
                    window.history.go( -1 );  
                }else{  
                    window.opener=null;window.close();  
                }  
        }else{ //未知的浏览器  
            window.history.go( -1 );  
        }  
    }  
}