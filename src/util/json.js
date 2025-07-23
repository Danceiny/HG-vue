function isString(str) {
    if (typeof str === 'string' || str instanceof String) {
        return true;// it's a string
    }

    else {
        // it's something else
        return false;
    }
}

export function isJSON(str, pass_object) {
    try{
        eval('('+str+')')
        return true
    }catch(e){
        return false
    }
}


export function button_format(obj){
    var content = document.getElementById(obj).value;
    document.getElementById(obj).value = JSON.stringify(JSON.parse(content), null, "\t");
}