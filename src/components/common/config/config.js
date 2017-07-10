/**
 * Created by dmy on 2017/5/15.
 */
//
global.is_debug = false

if (process.env.NODE_ENV == 'development') {
    global.is_debug = true
}

//表单不为空
global.regnull = /^[^.]+$/;

// 合法身份证号验证
global.regExpIdNumber = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

//合法手机号验证
global.regExpPhone =  /^1[34578]\d{9}$/;

// 真实姓名验证(必须是汉字，字母)
global.regExpRealName = /^[a-zA-Z\u4e00-\u9fa5]+$/;

//密码长度 6-18位 字母或数字
global.regExpPsw =  /^[a-zA-Z0-9]{6,18}$/ ;

//验证码校验
global.regExpAuthCode =  /(^\d{4}$)/;

//验证邮箱
global.regEmail =  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

//证书编号
global.regCerNumber=  /^[a-zA-Z0-9]{18}$/ ;

//倒计时时间
global.g_code_cd_time = 120
//折扣率
global.g_discount_rate = 0.5

//全局函数
global.check_valid_null = function(str){
    return !(str == null || str == '')
}
global.check_valid_id_number = function(str){
    return regExpIdNumber.test(str)
}
global.check_valid_phone = function(str){
    return regExpPhone.test(str)
}
global.check_valid_cer_number = function(str){
    return regCerNumber.test(str)
}

global.check_valid_name = function(str){
    return regExpRealName.test(str)
}

global.check_valid_psw = function(str){
    return regExpPsw.test(str)
}

global.check_valid_email = function(str){
    return regEmail.test(str)
}

global.check_valid_auth_code = function(str){
    return regExpAuthCode.test(str)
}

//原 网站域名
global.G_old_domain = "http://system.cecctm.com/"
global.G_domain = "http://cecctm.com/"
global.G_exam_domain = "http://exam.cecctm.com"
global.G_QQ_Group_Url= "https://jq.qq.com/?_wv=1027&k=49Zt99p"

//xdoc key
global.G_xdoc_key = "y2yjo5fzyrdeveza7rz56gwqva"
//官方QQ群
global.G_QQ_key = "342658389"
//cdn的路径配置
global.G_cdn_img_path = "http://cdn.cecctm.com/news/"
global.G_cdn_domain = "http://cdn.cecctm.com/"
//配置支持的支付方式
global.G_pay_channel = [
    //{"channel":"wx_pub","title":"微信"},
    {"channel":"alipay_pc_direct","title":"支付宝"},
]

